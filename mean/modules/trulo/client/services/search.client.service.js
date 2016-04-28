'use strict';
//currently this service is not being used
angular.module('trulo').factory('Search', [
  function () {
      var searchResult;
      var searchString;
    return {
        setSearchString: function(search){
            searchString = search;
        }
        , getSearchString: function(){
            return searchString;
        }
        , setSearchResult: function(result){
            console.log("Setting searchresult in search service");
            searchResult = result;
        }
        , getSearchResult: function(){
            return searchResult;
        }
    };
  }
]);
