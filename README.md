# IOT PROJECT - FACE MASK DETECTOR FOR NODE RED
This repository contains the code developed for the course of IOT. The scope of the project is to train and deply a machine learning model on Node Red with the aim of performing classification on images where the classes of interest are "with_mask" and "without_mask". 

The entire project has been developed on a virtual machine that mount a ubuntu OS, this because I had lots of problems in installing the necessary libraries and packages on the original windows on my laptop. 

The project result is the following:

INSERIRE GIF O QUALCOSA CHE MOSTRA RISULTATO

## Project procedure
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
Firstly install the package  @tensorflow/tfjs-node, from which other two package depend. To do this open the terminal and navigate inside the node-red folder (in my windows installation is in  User/NameOfUser/.node-red ) and run here the installing command by typing `npm install @tensorflow/tfjs-node` or use the `yarn` command as shown in [this page](https://www.npmjs.com/package/@tensorflow/tfjs-node). 
After this it should be easy to install the packages `node-red-contrib-tf-function` and `node-red-contrib-tf-model`. This time I isntalled those directly inside node-red. So type `node-red` in the terminal, open the node-red page on the browser an in the top right go to ...->...->... and in install enter the names of the two packages and install them. Additionally in here add the package `qualcosa-per-immagini`,  `node-red-contrib-browser-utils`.


### Create the custom node for the node-red environment


### Find/create a dataset for the model training
In my case I had to find a dataset that contains lots of images of people with and wothout masks. At the beginning I created a small dataset of 60 images using my webcam just for becoming confident with teh training of the model and perform fast trainings. Later I found on the internet these two dataset that I merged together. [Dataset_1](https://www.kaggle.com/omkargurav/face-mask-dataset) - [Dataset_2](https://www.kaggle.com/dhruvmak/face-mask-detection). 
In order to be able to use these images in my model I need to have all the images resized to a shape of 224x224 pixels. I did this using the [roboflow](https://roboflow.com/) website, which is a great tool for perfoming dataset augmentation and merging datasets with differents annotations. In this I simply loaded the entire dataset and requested to have all the images in the training folder with no augmentation but resizing all the images.


### Create and train a model for the image classification
For the training of the model I used a file on GoogleCollab that is available in this repository. 
At the beginning of the file all the libraries are installed, then the user is requested to give access to its google drive. This is required because the dataset for the model should be loaded on there for ease of use. It's important to specify the correct path to the dataset in the line that says `data_root = 'gdrive/MyDrive/...`. After that the dataset is loaded and parsed in train/test portions and the classes are detected. The classes on which the model will train are simply the names of the folder inside the dataset directory. 
Then the model structure is defined, in thsi case I take a pre built model from tfhub, in this case it is a model based on MobileNet_v2. After this the model is trained (training can take up to 1 hour with this dataset and 5 batches) and later saved locally on the GoogleCollab runtime.
The next section is composed of a bit of testing of teh model, both with just numerical percentages predictions and a grid of sample images with the predicted values.


### Convert the tensorflow model in a js friendly format
In order to use correctly the model on node-red it's necessary to save the model in a json friendly format. In order to do so I found a powerful tool from teenworflow which is called tensorflow [models converter](https://github.com/tensorflow/tfjs/tree/master/tfjs-converter) that you can install locally on your laptop an run from the terminal or run directly in the google collab file. In my case I preferred to use it directly in the google file. 
In the file the conversion is performed in just one line, where you have to specify the original type of model and the desired converted file. In this case the original file is a `tf_saved_model` and the friendly format model for node-red is `tfjs_graph_model`. The last section of the google collab file download the entire folder in which is saved the json model and the model.pb file. 


### Deploy the model in the node-red custom node
In order to 

### Install the node and run it

