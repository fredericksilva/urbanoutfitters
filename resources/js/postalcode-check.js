Venda.Ebiz.europePostalCheck = function (country) {
  var countries = ({
  	"United Kingdom" : {
  		"regex" : 
  		{
  			"validate" : "(GIR 0AA)|((((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9])) *?([0-9][ABD-HJLNP-UW-Z]{2})$)",
  			"format" : "(^[A-Z]{1,2}[A-Z0-9]{1,2}) *?([0-9][A-Z]{2}$)"
  		},
  		"deliminate" : " ",
  		"example" : "AA00 0AA"
  	},
  	"UK Channel Islands" : {
  		"regex" : 
  		{
  			"validate" : "(GIR 0AA)|((((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9])) *?([0-9][ABD-HJLNP-UW-Z]{2})$)",
  			"format" : "(^[A-Z]{1,2}[A-Z0-9]{1,2}) *?([0-9][A-Z]{2}$)"
  		},
  		"deliminate" : " ",
  		"example" : "AA00 0AA"
  	},
  	"UK Isle of Man" : {
  		"regex" : 
  		{
  			"validate" : "(GIR 0AA)|((((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9])) *?([0-9][ABD-HJLNP-UW-Z]{2})$)",
  			"format" : "(^[A-Z]{1,2}[A-Z0-9]{1,2}) *?([0-9][A-Z]{2}$)"
  		},
  		"deliminate" : " ",
  		"example" : "AA00 0AA"
  	},
  	"UK Jersey" : {
  		"regex" : 
  		{
  			"validate" : "(GIR 0AA)|((((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9])) *?([0-9][ABD-HJLNP-UW-Z]{2})$)",
  			"format" : "(^[A-Z]{1,2}[A-Z0-9]{1,2}) *?([0-9][A-Z]{2}$)"
  		},
  		"deliminate" : " ",
  		"example" : "AA00 0AA"
  	},
  	"UK Northern Ireland" : {
  		"regex" : 
  		{
  			"validate" : "(GIR 0AA)|((((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9])) *?([0-9][ABD-HJLNP-UW-Z]{2})$)",
  			"format" : "(^[A-Z]{1,2}[A-Z0-9]{1,2}) *?([0-9][A-Z]{2}$)"
  		},
  		"deliminate" : " ",
  		"example" : "AA00 0AA"
  	},
  	"UK Scottish Highlands" : {
  		"regex" : 
  		{
  			"validate" : "(GIR 0AA)|((((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9])) *?([0-9][ABD-HJLNP-UW-Z]{2})$)",
  			"format" : "(^[A-Z]{1,2}[A-Z0-9]{1,2}) *?([0-9][A-Z]{2}$)"
  		},
  		"deliminate" : " ",
  		"example" : "AA00 0AA"
  	},
  	"UK Isle of Wight" : {
  		"regex" : 
  		{
  			"validate" : "(GIR 0AA)|((((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9])) *?([0-9][ABD-HJLNP-UW-Z]{2})$)",
  			"format" : "(^[A-Z]{1,2}[A-Z0-9]{1,2}) *?([0-9][A-Z]{2}$)"
  		},
  		"deliminate" : " ",
  		"example" : "AA00 0AA"
  	}
  }),
  postalCode = jQuery('#zipc').val(),
  pcInvalidMsg = jQuery('#pcode-msg').length ? jQuery('#pcode-msg').text() : 'Please enter a valid postcode for your selected country e.g. ';
    if (countries[country] != null) {
		  var	countryCache = (countries[country]), 
				  validate = new RegExp(countryCache.regex.validate, "i"),
				  format = new RegExp(countryCache.regex.format, "i"),
				  deliminate = countryCache.deliminate || "",
				  prefix = countryCache.prefix || "";
		  if (postalCode.search(validate) != 0) {
					alert(pcInvalidMsg + countryCache.example);
					return false;
      } else if (postalCode.search(validate) == 0) {
					if (countryCache.regex.format != null) {
						jQuery('#zipc').val(postalCode.replace(format, "$1" + deliminate + "$2").toUpperCase());
					} else if (prefix != "") {
						jQuery('#zipc').val(postalCode.replace(validate, prefix + "$2"));
					} else {
						jQuery('#zipc').val(postalCode.replace(validate, "$1"));
					};
					return true;
		  };
		  return true;
    };
  return true;
}; 