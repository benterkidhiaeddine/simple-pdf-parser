# simple-pdf-parser
This is a simple demo to showcase how to use the pdf.js library to parse simple pdf file and display them line by line



 - Select a valid pdf file that is simple in structure that you want extract info from 
 - the extracted info will be available in the "Global_parsedContent" variable as an Array of pages , each page is and Array of lines , and each line is an Array of words contained in that line 

# Explanation :
 - this algorithm takes advantage of the property in the items contained in pdfPromise , this property is an object called Transform , and the 5th element of the transform property is Y coordinate of that item so we know items that are on the same line if they have the same Y coordinate