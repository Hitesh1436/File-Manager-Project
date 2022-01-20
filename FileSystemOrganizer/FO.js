// We will be creating a File System Organizer//
//Features of the Project -
//If you have numerous Files in a folder and they are not Properly arranged
//So you can use this tool to arrange them in specific directory according to their extension
// like text files will go into text File Folder .exe files will go into application folder and so on
// so at the end you will have a arranged set of files in specific folders

//js mein input Array ke from mein jaata hai and that is array is process.argv Array

const fs = require("fs");  // fs module import krwaya  h

const path = require("path"); // path module import krwaya 

let inputArr = process.argv.slice(2);

let types = {   //  yeh array bnya jo ext ke hisab se key btarha h konsi key ki ext h  and all
  media: ["mp4", "mkv", "mp3", "jpg", "png", "sng"],
  archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
  documents: [
    "docx",
    "doc",
    "pdf",
    "xlsx",
    "xls",
    "odt",
    "ods",
    "odp",
    "odg",
    "odf",
    "txt",
    "ps",
    "tex",
  ],
  app: ["exe", "dmg", "pkg", "deb"],
};


//[Node FO.js tree folderpath]

let command = inputArr[0];

switch (command) {
  case "tree":
    treeFn(inputArr[1]);
    break;
  case "organize":
    organizeFn(inputArr[1]);   //inputArr ke 1st index pr path bhjdenge
    break;
  case "help":
    helpfn();
    break;

  default:
    console.log("PLEASE ENTER A VALID Command");
    break;
}

function helpfn() {
  console.log(`List of all the Commands-
                    1) Tree Command - node FO.js tree <dirname>
                    2) Organize Command- node FO.js organize <dirname>
                    3) Help Command - node FO.js help`);
}


function organizeFn(dirpath) {      // folder tk phuch gye but ab edge cases dkhenge 
  // console.log(dirpath)  

  // input of a directory Path
  let destPath;

  if (dirpath == undefined) {
    console.log("Please Enter a valid Directory Path");
    //check whether dirpath is passed or not
    return;
  } else {
    let doesExist = fs.existsSync(dirpath);
    //  console.log(doesExist)

    // this will tell whether the dirpath exsists or not (agr hoga toh true dega vrna false dega)


    if (doesExist == true) {
      destPath = path.join(dirpath, "organized_files");

      //   D:\Batches\FJP3 Dev\test Folder\organized_files - I want to create a folder in this path

      if (fs.existsSync(destPath) == false) {
        fs.mkdirSync(destPath); // we will only create a folder if it does not already exists
      } else {
        console.log("This folder Already Exists");
      }
    } else {
      console.log("Please Enter a valid Path");
    }
  }

  organizeHelper(dirpath, destPath)


}

// we are writing this function to categorize our files
function organizeHelper(src, dest) {
  let childNames = fs.readdirSync(src) // get all the files and folders inside your src
  //console.log(childNames) 

  for (let i = 0; i < childNames.length; i++) {
    let childAddress = path.join(src, childNames[i]) // path is identified for the files using path , name se check ni hota 
    let isFile = fs.lstatSync(childAddress).isFile() // we check here to identify only the files and folder ni lena
    //console.log(childAddress + "  " + isFile)   // yh btadega konsa true h mtlb file h and false mtlb kon ni h .

    // lstatSync = jo bhi path pass kia h folder ya file ka uske stats nikal leta h and uspe ek key hoti h jo btati h yeh file thi ya folder
    if (isFile == true) {
      let fileCategory = getCategory(childNames[i]);
      console.log(childNames[i] + "  belongs to  " + fileCategory)  // kya hum particular extensions ko match krpye hain vo dkh rhe hain isse , jse hi run hoga toh getCategory function ko call lgega vo type return krega and vo fileCategory mn lakr dega and  usse console log krenege
      // we took out category type of different files
      sendFiles(childAddress, dest, fileCategory)  // yeh fileCategory ko call lgyga 
    }
  }
}


function getCategory(name) {
  let ext = path.extname(name)
  //console.log(ext)  // ext name dedega hume jo hain files ki
  ext = ext.slice(1)  // isse ext mn se dot htaya h humne 
  //  console.log(ext)

  for (let type in types) {    // for every key type in object types loop lgaya humne
    let cTypeArr = types[type]   // yeh ek ek array jo key hn dedega
    //console.log(cTypeArr)

    for (let i = 0; i < cTypeArr.length; i++) {  // yeh loop lgya jo 4 array mili hain hume unpr loop lgaya
      if (ext == cTypeArr[i])
        // we matched the extensions with the values presnet in ctypeArr and uss type ko return krenge 

        return type
    }
  }


  return 'others'    // koi type match ni hua toh others return krdega .


}


function sendFiles(srcFilePath, dest, fileCategory) {  // hume source path chaiyee dest path khn bhjni h file uske liye and konsi category ka h vo bhi chaiye
  let catPath = path.join(dest, fileCategory)   // here we are making file categories path


  if (fs.existsSync(catPath) == false) { // checking for category folder path 
    fs.mkdirSync(catPath)   // yeh folders bnaega console krenge tb files ke hisab se jse hmre documents and media bnega sirf 
  }


  let fileName = path.basename(srcFilePath) /// we took out the names of the files
  let destFilePath = path.join(catPath, fileName) // here we created a path for the files in category folders


  fs.copyFileSync(srcFilePath, destFilePath) // copied files from src to dest

  fs.unlinkSync(srcFilePath) // deleted the files from src  mtlb copies ko htane ke liye bhr se 


  console.log(fileName + "is copied to" + fileCategory)
}



// Tree method implement krenge ab 

function treeFn(dirpath) {
  if (dirpath == undefined) {
    console.log('Please Enter a Valid Command ')
  }

  else {
    let doesExist = fs.existsSync(dirpath);
    if (doesExist == true) {
      treeHelper(dirpath, " ")
    }
  }
}

function treeHelper(targetPath, indent) {   // indent denge space ke liye 
  let isFile = fs.lstatSync(targetPath).isFile()   // check krrhe hain file konsi h folder konsa h

  if (isFile == true) {
    let fileName = path.basename(targetPath)
    console.log(indent + "├──" + fileName)  //"├──"  isse khde hain Include and this will display the files

  }
  else {
    let dirname = path.basename(targetPath);
    console.log(indent + "└──" + dirname)    // "└──" yeh down dikhta h and it will display the folders

    let children = fs.readdirSync(targetPath)  // sare children nikale humne 
    // console.log(children) 

    for (let i = 0; i < children.length; i++) {
      let childPath = path.join(targetPath, children[i]);

      //  console.log(childPath)
      treeHelper(childPath, indent + '\t')  // using recursion to run for all files and folders
    }

  }
}