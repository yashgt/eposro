# i hav provided an implicit doc
newDoc = []
newProduct = {}

# THIS IS THE 'FLATTEND' DOCUMENT WHICH IS GIVEN BY DEFAULT SOLR_DOC_MANAGER
d = {
	'_id':5
	,'v': 1		
	,'name':"Collared T-shirt"
	,'brand':"CK"
	,'cats.0':2
    ,'cats.1':15
    ,'cats.2':100
	,'desc':"Stylish T-shirt"
	,'facets.style':"collared"
    ,'facets.pocket':"yes"
	,'attrs.type':"cotton"
	,'cities.0': 5
    ,'cities.1':6

	,'vars.0.facets.color':"blue"
    ,'vars.0.facets.size':"XL"
    ,'vars.1.facets.color':"blue"
    ,'vars.1.facets.size':"L"

	,'pricing.default_mrp': 500
    ,'mrp.0.city':5
    ,'mrp.0.mrp' : 520
 }

#DO YOUR CHANGES HERE****
    def reformat(dict):
        new_docs = []
        new_prod = {}
        for key, value in dict.items():
            """ if(key starts with "cities")
                    split key by "." => keypart[0], keypart[1], value
                    new_prod['cities'][keypart[1]] = value
                if(key == "pricing.default_mrp")
                    new_prod["default_mrp"] = value
                    del dict['pricing.default_mrp']
                if(key startswith 'pricing.mrp')
                    split key by '.' => 'pricing', 'mrp', index, 'city'
                    new_prod['city.'value'.mrp'] = dict['pricing.''mrp.' index '.mrp']
            """
        """Now identify variants
        for key, value in new_prod.items():
            """ if(key startswith 'vars.')
        
    
    @wrap_exceptions
    def upsert(self, doc, namespace, timestamp):
        """Update or insert a document into Solr

        This method should call whatever add/insert/update method exists for
        the backend engine and add the document in there. The input will
        always be one mongo document, represented as a Python dictionary.
        """
        flat_doc = self._clean_doc(doc, namespace, timestamp)
        
        docs = reformat(flat_doc)
        if self.auto_commit_interval is not None:
            self.solr.add(docs,
                          commit=(self.auto_commit_interval == 0),
                          commitWithin=u(self.auto_commit_interval))
        else:
            self.solr.add(docs,
                          commit=False)


"""
	if key == "cats":
		for i in range(len(value)):
			print "key :", key, "   ***value :", value[i] 
	elif key == "facets":
		for i,j in value.iteritems():
                        print "key :", key, "   ***value :", value[i]
	elif key == "attrs": 
		for i,j in value.iteritems():
			print "key :", key, "   ***value :", value[i]
        elif key == "cities":
		for i in range(len(value)):
			print "key :", key, "   ***value :", value[i]
	#elif key == "pricing":
	#	for i,j in value.iteritems():
	#		print "key :", key, "***value :", value[i]
	else:
		print "key :",key,"   ***value :",d[key]
			
"""	
for key,value in newProduct.iteritems():
        print key, value
		

