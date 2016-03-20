# THIS IS THE 'FLATTEND' DOCUMENT WHICH IS GIVEN BY DEFAULT SOLR_DOC_MANAGER

dict = {
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
    ,'pricing.mrp.0.city':5
    ,'pricing.mrp.0.mrp' : 520
 }

#DO YOUR CHANGES HERE****
def reformat(dict):
 
new_docs = []
new_prod = {}

count = 0

for k, v in dict.iteritems():
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

"""
    if key.split(".")[0] == 'cities':
        new_prod.setdefault(key.split('.')[0],[]).append(value)
    if key.split('.')[0] == 'pricing':
        if key.split(".")[0] + '.' + key.split(".")[1] == 'pricing.default_mrp':
            new_prod.setdefault(key.split('.')[0],{})[key.split('.')[1]] = value
        if key.split(".")[0] + '.' + key.split(".")[1] == 'pricing.mrp':
            a = {key.split('.')[3] : value}
            mrp.append(a)
            new_prod.setdefault(key.split('.')[0],{})[key.split('.')[1]] = mrp"""
			
			
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
            """ 
					
        
    
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

