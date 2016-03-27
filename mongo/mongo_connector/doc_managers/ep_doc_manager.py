# Copyright 2013-2014 MongoDB, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Receives documents from the oplog worker threads and indexes them
into the backend.

This file is a document manager for the Solr search engine, but the intent
is that this file can be used as an example to add on different backends.
To extend this to other systems, simply implement the exact same class and
replace the method definitions with API calls for the desired backend.
"""
import json
import logging
import os
import re

from pysolr import Solr, SolrError

from mongo_connector import errors
from mongo_connector.compat import u
from mongo_connector.constants import (DEFAULT_COMMIT_INTERVAL,
                                       DEFAULT_MAX_BULK)
from mongo_connector.compat import (Request, urlopen, urlencode, URLError, HTTPError)
from mongo_connector.util import exception_wrapper, retry_until_ok
from mongo_connector.doc_managers.doc_manager_base import DocManagerBase
from mongo_connector.doc_managers.formatters import DocumentFlattener
from mongo_connector.doc_managers.solr_doc_manager import DocManager as SDM

wrap_exceptions = exception_wrapper({
    SolrError: errors.OperationFailed,
    URLError: errors.ConnectionFailed,
    HTTPError: errors.ConnectionFailed
})

ADMIN_URL = 'admin/luke?show=schema&wt=json'
# From the documentation of Solr 4.0 "classic" query parser.
ESCAPE_CHARACTERS = set('+-&|!(){}[]^"~*?:\\/')

decoder = json.JSONDecoder()


class EPDocumentFlattener(DocumentFlattener):
    """Formatter that completely flattens documents and unwinds arrays:

    An example:
      {"a": 2,
       "b": {
         "c": {
           "d": 5
         }
       },
       "e": [6, 7, 8]
      }

    becomes:
      {"a": 2, "b.c.d": 5, "e.0": 6, "e.1": 7, "e.2": 8}

    """

    def transform_element(self, key, value):
        #Do your custom stuff here
        if key=="cats":
            yield key, self.transform_value(value)
        else:
            yield super().transform_element(key,value)
            """for item in super().transform_element(key,value):
                yield item
            """
        



class DocManager(SDM):
	def reformat(self,dict):
		new_docs = []
		new_prod = {}

		count = 0
		docNums = 0
	
		for k, v in dict.items():
			if k.split('.')[0] == 'vars':
				if count == 0:
					docNums  = int(k.split('.')[1])
					count = count + 1
				elif int(k.split('.')[1]) > docNums :
					docNums  = int(k.split('.')[1])
		docNums = docNums + 1		# docNums variable tells how many documents to be created

		for i in range(docNums): 	
			new_prod = {}
			for key, value in dict.items():
				if (key.split(".")[0] != 'cities') & (key.split('.')[0] != 'vars') & (key.split('.')[0] != 'pricing'):
					new_prod[key] = value
				if key.split(".")[0] == 'cities':
					new_prod.setdefault(key.split('.')[0],[]).append(value)
				if key.split('.')[0] == 'pricing':
					if key.split(".")[0] + '.' + key.split(".")[1] == 'pricing.default_mrp':
						new_prod[key.split('.')[1]] = value
						#del dict['pricing.default_mrp']
					if key.split('.')[0] + '.' + key.split('.')[1] == 'pricing.mrp':
						if key.split('.')[3] == 'mrp':
							continue
						else:    
							new_prod[key.split('.')[3] + '.' + str(value)+ '.' + key.split('.')[1]] = dict['pricing.mrp.' + key.split('.')[2] + '.mrp']
				if key.split('.')[0] == 'vars':
					if int(key.split('.')[1]) == i:
						new_prod[key.split('.',2)[2]] = value
			new_docs.append(new_prod)
		print(new_docs)
		return new_docs
	
	@wrap_exceptions
	def upsert(self, doc, namespace, timestamp):
		print("In upsert")
		flat_doc = self._clean_doc(doc, namespace, timestamp)
		print(flat_doc)
		docs = self.reformat(flat_doc)
		if self.auto_commit_interval is not None:
			self.solr.add(docs, commit=(self.auto_commit_interval == 0), commitWithin=u(self.auto_commit_interval))
		else:
			self.solr.add(docs, commit=False)
	
	def bulk_upsert(self, docs, namespace, timestamp):
		print("hey")
		if self.auto_commit_interval is not None:
			add_kwargs = {
				"commit": (self.auto_commit_interval == 0),
				"commitWithin": str(self.auto_commit_interval)
			}
		else:
			add_kwargs = {"commit": False}
		
		for i in docs:
			print(i)
		
		cleaned = (self._clean_doc(d, namespace, timestamp) for d in docs)
		"""print cleaned	"""
		
		if self.chunk_size > 0:
			print("hell0 27")
			batch = list(next(cleaned) for i in range(self.chunk_size))
			while batch:
				for i in batch:
					print(i)
				a = [y for x in batch for y in x]
				print(a)
				self.solr.add(a, **add_kwargs)
				batch = list(next(cleaned) for i in range(self.chunk_size))
		else:
			self.solr.add(cleaned, **add_kwargs)