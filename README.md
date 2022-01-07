# IOT PROJECT - FACE MASK DETECTOR FOR NODE RED
This repository contains the code developed for the course of IOT. The scope of the project is to train and deply a machine learning model on Node Red with the aim of performing classification on images where the classes of interest are "with_mask" and "without_mask". 

The entire project has been developed on a virtual machine that mount a ubuntu OS, this because I had lots of problems in installing the necessary libraries and packages on the original windows on my laptop. 

The project result is the following:

<img src="https://github.com/AlessandroAvi/Node_red_tfjs_classification/blob/main/Img/example.gif" alt="My Project GIF" width="1000" height="500">

Here is a closer image of the prediction:

![Prediction](https://github.com/AlessandroAvi/Node_red_tfjs_classification/blob/main/Img/prediction.jpg)




# HOW TO REPLICATE THE PROJECT
The project is about the application of machine learning on node-red, a flow based developement tool for visual programming. The aim of the project was to develope a node that once taken an image in input is able to classify it and define if the image contains a mask or not. The idea comes from [this tutorial](https://developer.ibm.com/tutorials/building-a-machine-learning-node-for-node-red-using-tensorflowjs/) developed by Paul Van Eck at IBM, whom also posted a video tutorial explaining the project [here](https://www.youtube.com/watch?v=bOdlPwWej98&t=0s).  
My project exploits the same idea but applies it on a smaller classification problem.

The project work flow is:
- Set up the pc installing node.js, node-red and all the packages
- Create the custom node for the node-red environment
- Find/create a dataset for the model training
- Create and train a model for the image classification
- Convert the tensorflow model in a js friendly format
- Deploy the model in the node-red custom node
- Install the node and run it

## INSTALL THE NECESSARY SOFTWARE AND PACKAGES
For the installation of node.js and node-red (see [here](https://nodered.org/docs/getting-started/windows#1-install-nodejs) ) it is recommended to use the version 14.x from their official [download page](https://nodejs.org/en/) .

For the installation of node-red it should be enough to use the commands in the terminal `npm install -g --unsafe-perm node-red`

After this it's required to insall some additional node-red packages. One of the most important is the installation of @tensorflow/tfjs-node, from which other packages will depend. In order to install it in windows simply use the explorer and move in the folder:  User/NameOfUser/.node-red. Here press CTRL+LEFT MOUSE and open the power shell. Now type the commadn `npm install @tensorflow/tfjs-node`, which will install the entire package of tfjs. (For ubuntu open the terminal, move in the same folder with ~/.node-red and type `yarn add @tensorflow/tfjs-node`). For more info of the installation of @tensorflow/tfjs-node go [here](https://www.npmjs.com/package/@tensorflow/tfjs-node). 

After the installation of tfjs other packages are required for the correct usage of the custom node. In order to install these simply open node red->top right corner open setting tab->Manage palette->Install, and here install these packages:
- `node-red-contrib-tf-function`
- `node-red-contrib-tf-model`
- `node-red-contrib-browser-utils`
- `node-red-contrib-image-tools`

NOTE: I had problems installing @tensorflow/tfjs-node on Windows, for some reason some files are missing and the packages tf-function and tf-model are not working. I resolved the problem by installing the node on a virtual machine running Ubuntu. 

## CREATE THE CUSTOM NODE
For the creation of the node follow the [tutorial](https://www.youtube.com/watch?v=bOdlPwWej98&t=0s) by IBM, that I also followed step by step. I later applied minor differences since my project uses classifications and not detection of objects with bounding boxes.

## FIND/CREATE A DATASET FOR THE MODEL TRAINING
In my case I had to find a dataset that contains lots of images of people with and without masks. At the beginning I created a small dataset of 60 images using my webcam just for becoming confident with the training of the model and perform fast trainings. Later I found on the internet these two dataset that I merged together. 

[Dataset_1](https://www.kaggle.com/omkargurav/face-mask-dataset)   -   [Dataset_2](https://www.kaggle.com/dhruvmak/face-mask-detection)

In order to be able to use these datasets in the training I need to have all the images resized to a shape of 224x224 pixels. I did this using the [roboflow](https://roboflow.com/) website, which is a great tool for perfoming dataset augmentation and merging datasets with differents annotations. Here I simply loaded the entire dataset (max 10k images for the free trial) and requested to have all the images resized. In this case I didn't applied any augmentation.

Since I was able to load models from the web I also trained a model to classify dogs and cats. This allows me to show the flexibility of this custom node and its ease of use. The model that I trained can be found at the [link](https://github.com/AlessandroAvi/Node_red_tfjs_classification/tree/main/Saved_model/Dog_cat_classificator). In this case the dataset that I used is downloaded from [here](https://www.kaggle.com/karakaggle/kaggle-cat-vs-dog-dataset) and I reduced its size to a total of 10000 images beacuse of the free trial of roboflow.

## CREATE AND TRAIN A MODEL FOR THE IMAGE CLASSIFICATION
For the training of the model I used a Jupyter notebook that I loaded on GoogleCollab. The file is available [here](https://github.com/AlessandroAvi/Node_red_tfjs_classification/blob/main/Training_classification_mask.ipynb). 

At the beginning of the file all the libraries are installed, then the user is requested to give access to its google drive. This is required because the dataset for the model should be loaded on there for ease of use. It's important to specify the correct path to the dataset in the line that says `data_root = 'gdrive/MyDrive/...`. After that the dataset is loaded and parsed in train/test portions and the classes are detected. The classes on which the model will train are simply the names of the folder inside the dataset directory. 

Then the model structure is defined. In this projecy I load a pre built model from TFhub which is based on MobileNet_v2. After this the model is trained and later saved locally on the GoogleCollab runtime.
The following section of the notebook contains the testing of the model which is performed on the entire portion of the dataset dedicated to the testing. The results of the testing can be seen in both a dataframe and in a grid of images.

## CONVERT THE TF MODEL IN A JSON FORMAT
In order to use correctly the model on node-red it's necessary to save it in a json format. For doing so it's possible to use a tensorflow tool called [models converter](https://github.com/tensorflow/tfjs/tree/master/tfjs-converter). The tool can be installed locally on the laptop and used from the terminal or it can be installed directly in the GoogleCollab file and executed there. In this cane I decided to run it in the Notebook.

The conversion is performed in just one line, where you have to specify the original type of model, the desired converted file and some other additional parameters. In this case the original file is a `tf_saved_model` and the output file, which is a json, is `tfjs_graph_model`. The last section of the google collab file download the entire folder in which is saved the json model and the model.pb file. 

## DEPLOY THE MODEL IN THE NODE-RED CUSTOM NODE
In order to deploy the model in the node it's enough to load it in a GitHub repository and at runtime, inside the node informations on node-red, specify the link of the custom node. Another possibility is to load the json file locally in a folder in the laptop and specify the path to that file. 

For this project I used the model that I previously trained and loaded in this repo. Note that in order to run it correctly and not obtain error it's necessary to select the RAW version of the model.json. In my case the RAW model can be selected from [this link](https://github.com/AlessandroAvi/Node_red_tfjs_classification/blob/main/Saved_model/Mask_classificator/converted_model/model.json) just by selecting the RAW option. (The correct link is the following: [link to the model](https://raw.githubusercontent.com/AlessandroAvi/Node_red_tfjs_classification/main/Saved_model/Mask_classificator/converted_model/model.json)).

## INSTALL THE NODE AND RUN IT
In order to install the custom node in node-red and run it, only two commands from the terminal are required.

Open the terminal and move inside the folder of the custom node. Here type `yalc publish`.

Then, again in the terminal, move in the folder in which node-red is installed (in windows installation it should be: User/NameOfUser/.node-red, on Ubuntu it should be: cd ~/.node-red/ ) and here type the command `yalc add name-of-the-node`. In this case the name of the node is `node-red-contrib-tfjs-my_node`.
Once done this it's enough to run the node-red command, insert the node in the flow. Connect its output to a debug node and its input to the file inject node (additionally add the image viewr node).

<img src="https://github.com/AlessandroAvi/Node_red_tfjs_classification/blob/main/Img/install.gif" alt="Installation of the node" width="1000" height="300">

NOTE: if at the first try of prediction an error appears in the debug tab, simply remove the node, deploy everything, re-insert the node and deploy again everything. This procedure works almost every time.

