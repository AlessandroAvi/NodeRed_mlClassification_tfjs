# IOT PROJECT - FACE MASK DETECTOR FOR NODE RED
This repository contains the code developed for the course of IOT. The scope of the project is to train and deply a machine learning model on Node Red with the aim of performing classification on images where the classes of interest are "with_mask" and "without_mask". 

The entire project has been developed on a virtual machine that mount a ubuntu OS, this because I had lots of problems in installing the necessary libraries and packages on the original windows on my laptop. 

The project result is the following:

<img src="https://github.com/AlessandroAvi/Node_red_tfjs_classification/blob/main/Img/example.gif" alt="My Project GIF" width="1000" height="500">

Here is a closer image of the prediction:

![Prediction](https://github.com/AlessandroAvi/Node_red_tfjs_classification/blob/main/Img/prediction.jpg)


## PROJECT PROCEDURE
The project is about the application of machine learning on node-red, a flow based developement tool for visual programming. The aim of the project was to develope a node that once taken an image in input is able to classify it and define if the image contains a mask or not. The idea comes from [this tutorial](https://developer.ibm.com/tutorials/building-a-machine-learning-node-for-node-red-using-tensorflowjs/) developed by Paul Van Eck at IBM, whom also posted a video tutorial explaining the project [here](https://www.youtube.com/watch?v=bOdlPwWej98&t=0s).  
My project exploits the same idea but applies it on a smaller classification problem.

The project work flow is:
- Install the necessary packages and libraries
- Create the custom node for the node-red environment
- Find/create a dataset for the model training
- Create and train a model for the image classification
- Convert the tensorflow model in a js friendly format
- Deploy the model in the node-red custom node
- Install the node and run it

### Install the necessary packages and libraries
For the project is required the installation of an IDE, node.js, node-red and some packages and libraries.
For the installation of node.js (see [here](https://nodered.org/docs/getting-started/windows#1-install-nodejs) ) it is recommended to use the version 14.x from their official [download page](https://nodejs.org/en/) .
For the installation of node-red it should be enough to use the commands in the terminal `npm install -g --unsafe-perm node-red`
For the correct usage of my node and the node developed in the tutorial is also necessary to install soem node-red packages. I had lots of problems installing these because of inexperience, so I suggest following these steps.
Firstly install the package  @tensorflow/tfjs-node, from which other two package depend. To do this open the terminal and navigate inside the node-red folder (in windows installation it should be: User/NameOfUser/.node-red, on ubuntu it should be:  ~/.node-red/ ) and run here the installing command by typing `npm install @tensorflow/tfjs-node` or use the `yarn` command as shown in [this page](https://www.npmjs.com/package/@tensorflow/tfjs-node). 
After this it should be easy to install the packages `node-red-contrib-tf-function` and `node-red-contrib-tf-model`. This time I isntalled those directly inside node-red. So type `node-red` in the terminal, open the node-red page on the browser an in the top right go to ...->...->... and in install enter the names of the two packages and install them. Additionally in here add the package `qualcosa-per-immagini`,  `node-red-contrib-browser-utils`.

### Create the custom node for the node-red environment
For the creation of teh node follow the tutorial by IBM, that I also followed step by step. I later applied minor differences since my project uses classifications and not detection of objects with bounding boxes.

### Find/create a dataset for the model training
In my case I had to find a dataset that contains lots of images of people with and without masks. At the beginning I created a small dataset of 60 images using my webcam just for becoming confident with the training of the model and perform fast trainings. Later I found on the internet these two dataset that I merged together. [Dataset_1](https://www.kaggle.com/omkargurav/face-mask-dataset) - [Dataset_2](https://www.kaggle.com/dhruvmak/face-mask-detection). 
In order to be able to use these images in the training I need to have all the images resized to a shape of 224x224 pixels. I did this using the [roboflow](https://roboflow.com/) website, which is a great tool for perfoming dataset augmentation and merging datasets with differents annotations. In this I simply loaded the entire dataset and requested to have all the images in the training folder with no augmentation.
Since I was able to load models from th web I alsot rained a model to classify dogs and cats in order to show the felxibility of this node. The model that I trained can be found at the [link](https://github.com/AlessandroAvi/Node_red_tfjs_classification/tree/main/Saved_model). In this case the dataset that I used is downloaded from [here](https://www.kaggle.com/karakaggle/kaggle-cat-vs-dog-dataset) and I reduced its size to a total of 10000 images.

### Create and train a model for the image classification
For the training of the model I used a file on GoogleCollab that is available in this repository under the name `Training_classification_mask.ipynb`. 
At the beginning of the file all the libraries are installed, then the user is requested to give access to its google drive. This is required because the dataset for the model should be loaded on there for ease of use. It's important to specify the correct path to the dataset in the line that says `data_root = 'gdrive/MyDrive/...`. After that the dataset is loaded and parsed in train/test portions and the classes are detected. The classes on which the model will train are simply the names of the folder inside the dataset directory. 
Then the model structure is defined, in this projecy I load a pre built model from tfhub which is absed on MobileNet_v2. After this the model is trained and later saved locally on the GoogleCollab runtime.
The following section of the notebook contains the testing of the model which is performed on the entire portion of the dataset dedicated to the testing. The results of the testing can be seen in both a dataframe and in a grid of images.

### Convert the tensorflow model in a js friendly format
In order to use correctly the model on node-red it's necessary to save it in a json format. In order to do so in the notebok it's necessary to install the tool from tensorflow called [models converter](https://github.com/tensorflow/tfjs/tree/master/tfjs-converter). It's also possible to install it locally on the laptop and later run it throught the terminal bot for ease of use everything can be done in the google collab notebook. 
In the file the conversion is performed in just one line, where you have to specify the original type of model, the desired converted file and some other additional parameters. In this case the original file is a `tf_saved_model` and the formal that generates a json model is `tfjs_graph_model`. The last section of the google collab file download the entire folder in which is saved the json model and the model.pb file. 

### Deploy the model in the node-red custom node
In order to deploy the model in the node it's enough to load it in a GitHub repository and at runtime specify the link in the informations of the custom node. Another possibility is to load the json file locally in a folder in the laprop and specify the path to that file. 
Note that in this case it has been decided to use the model.json loaded on this GitHub repository, and it's necessary to give to the model the raw link to the file. In the case of the model for the mask/no mask classification the link is the following [link to the model](https://raw.githubusercontent.com/AlessandroAvi/Node_red_tfjs_classification/main/Saved_model/Mask_classificator/converted_model/model.json). 

### Install the node and run it
In order to install the custom node in node-red and run it only two commands from the terminal are required.
Open the terminal and move inside the folder of the custom node. Here type `yalc publish`.
Then, again in the terminal, move in the folder in which nide-red is installed (in windows installation it should be: User/NameOfUser/.node-red, on ubuntu it should be: cd ~/.node-red/ ) and here type the command `yalc add name-of-the-node`. In this case the name of the node is `node-red-contrib-tfjs-my_node`.
Once done this it's enough to run the node-red command, insert the node in the flow, connect it to a debug node and an inert image node and give to it the image that youw ant to classify.

<img src="https://github.com/AlessandroAvi/Node_red_tfjs_classification/blob/main/Img/install.gif" alt="Installation of the node" width="1000" height="300">


NOTE: if at the first try of prediction an error appears in the debug tab, simply remove the node, deploy everything, re insert the node and deploy again averything. This procedure works almost every time.

