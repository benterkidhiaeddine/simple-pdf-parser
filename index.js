//select the different html elements

const pdfFileInput = document.getElementById("pdfFile");
const displayButton = document.getElementById('display-button');
const resultDiv = document.getElementById('result');


//fileReader object for reading the pdf 

const fileReader = new FileReader();


//global variable to store the parsed content from the fulfilled promise
let Global_parsedContent;

//when the display button is clicked 

displayButton.addEventListener('click',()=>{
    for (let page of Global_parsedContent){

        for (let line of page){
            
            const paraElement = document.createElement('p');
           
            
            
            paraElement.innerText = line.join(" ");
            resultDiv.appendChild(paraElement);
        }
    }
})




//when the file is selected run the parsing function
pdfFileInput.addEventListener('change',()=>{

    const file = pdfFileInput.files[0];
    console.log(file.name);
    fileReader.readAsDataURL(pdfFileInput.files[0]);
    
    //if the reading of the file is successful 
    fileReader.onload = ()=>{
        const fileReaderResult = fileReader.result;

        console.log(pdfParse(fileReaderResult));

        pdfParse(fileReaderResult).then((parsedContent)=>{
            Global_parsedContent = parsedContent;

        })


    }
})
//the parsing function of the Pdf
async function pdfParse(fileData){
    //this variable to denote the property name of Y coordinate of a given text in the pdf file in Relation to the transform object inside the items of the parsed pdf
    const Y_POSITION_COORDINATE = 5;
    
    //pages list to store the parsed text from the different pages
    const pages = [];
    //the pdf promise that contains all the parsed pdf data that we need 
    const pdfPromise = await pdfjsLib.getDocument(fileData).promise;
    //get the number of pages in the pdf 
    const numberOfPages = pdfPromise._pdfInfo.numPages;

    for (let i = 1 ; i <= numberOfPages ; i++) {
        //lines is a list where we store the different lines parsed from the pdf page
        const lines = [];

        const page = await pdfPromise.getPage(i);
        const textContent = await page.getTextContent();
        //the Y coordinate of the first parsed item in the page
        let lastY = textContent.items[0].transform[Y_POSITION_COORDINATE];
        lines.push([textContent.items[0].str]);
        
        // we loop over each item and compare it's Y coordinate to the Y coordinate of the last Item , if it's the same they are on the same line if they are different they are on different lines
        for (let i = 1; i < textContent.items.length; i++) {
            if (lastY !== textContent.items[i].transform[Y_POSITION_COORDINATE]) {
                lines.push([textContent.items[i].str]);
            } else {
                if (textContent.items[i].str.trim() === "") {
                    lastY = textContent.items[i].transform[Y_POSITION_COORDINATE];
                    continue;
                }
                lines[lines.length - 1].push(textContent.items[i].str);
            }
            lastY = textContent.items[i].transform[Y_POSITION_COORDINATE];
        }
    
        pages.push(lines);
    }
    console.log(pages);
    return pages;

}