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
            yield from super().transform_element(key,value)
            """for item in super().transform_element(key,value):
                yield item
            """
        



class DocManager(SDM):
    """The DocManager class creates a connection to the backend engine and
    adds/removes documents, and in the case of rollback, searches for them.

    The reason for storing id/doc pairs as opposed to doc's is so that multiple
    updates to the same doc reflect the most up to date version as opposed to
    multiple, slightly different versions of a doc.
    """

"""
    def __init__(self, url, auto_commit_interval=DEFAULT_COMMIT_INTERVAL,
                 unique_key='_id', chunk_size=DEFAULT_MAX_BULK, **kwargs):
        super().__init__(url, auto_commit_interval, unique_key, chunk_size, **kwargs)
        self._formatter = EPDocumentFlattener()
"""

    def _clean_doc(self, doc, namespace, timestamp):
        flat_doc = super()._clean_doc(doc, namespace, timestamp)
        print(json.dumps(flat_doc))
        return flat_doc		
        
