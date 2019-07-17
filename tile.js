// JavaScript source code
// tile v06 - 7:08p @ 7/3/19 Fully-Working Unfolded Rubik's Cube, now able to move pieces;
//                  need to cleanup code and implement a solver
//

void setup()
{

    size(1300, 1300); //defines dimension of the display window in units of pixels
    frameRate(60);    
    println("Initialized");

    window.tessaract = [["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"], /* (0) UP face - Yellow; NOTE: 8th Value is meant as stand-in for 0th Value*/ 
                ["W", "W", "W", "W", "W", "W", "W", "W", "W"], /* (1) Down face - White */
                ["O", "O", "O", "O", "O", "O", "O", "O", "O"], /* (2) Front face - Orange */
                ["R", "R", "R", "R", "R", "R", "R", "R", "R"], /* (3) Back face - Red */
                ["B", "B", "B", "B", "B", "B", "B", "B", "B"], /* (4) Right face - Blue */
                ["G", "G", "G", "G", "G", "G", "G", "G", "G"], /* (5) Left face - Green */
                ["A", "A", "A", "A", "A", "A", "A", "A", "A"] /* (6) Extra face "N"; acts as a buffer */
                ];

    window.tileSize = 60; //note: 'window.' makes the variable global

    window.trueCenterX = 600;
    window.trueCenterY = 600;

}


void draw() /*called directly after setup() and continuously executes code in block until prgrm is stopped
            or noLoop() is called */
{

    background(150, 150, 150); //sets the background of the processing window to Grey // (Red, Green, Blue)
    fill(115, 255, 248); //sets the color used to fill shapes onward // (R, G, B)

    //drawFace(Face Index, Orientation, X, Y)
    //baseRotation(Face Index, CW as True/False, # of Rotations)
    //relSideCopy(Index of face to be copied, "side of face to be copied" (top, right, bot, left), Index of overwritten face, side of overwritten face)
    //quarterRotate("face" (U, F, B', R', etc.), # of Rotations)

    drawFace(0, 0, window.trueCenterX + (8*window.tileSize), window.trueCenterY + (8*window.tileSize));
    
    //quarterRotate("D", 1);

    drawFace(0, 0, window.trueCenterX, window.trueCenterY); //UP
    drawFace(4, 3, window.trueCenterX + (4*window.tileSize), window.trueCenterY); //Right
    drawFace(1, 2, window.trueCenterX + (8*window.tileSize), window.trueCenterY); //Down (on the Right side)
    drawFace(5, 1, window.trueCenterX - (4*window.tileSize), window.trueCenterY); //Left
    drawFace(1, 2, window.trueCenterX - (8*window.tileSize), window.trueCenterY); //Down (on the Left side)
    drawFace(3, 2, window.trueCenterX, window.trueCenterY - (4*window.tileSize)); //Back
    drawFace(2, 0, window.trueCenterX, window.trueCenterY + (4*window.tileSize)); //Front
    drawFace(1, 0, window.trueCenterX, window.trueCenterY - (8*window.tileSize)); //Down (on Back)
    drawFace(1, 0, window.trueCenterX, window.trueCenterY + (8*window.tileSize)); //Down (on Front) */
}

void keyPressed(){
    println("Key Pressed");

    if(key == 'F' || key == 'B' || key == 'R' || key == 'L' || key == 'U' || key == 'D'){
        
        quarterRotate(str(key) + "'", 1); //SHIFT + Key = CCW rot
    }; 
    
    if(key == 'f' || key == 'b' || key == 'r' || key == 'l' || key == 'u' || key == 'd'){
        
        quarterRotate(str(key), 1); //Key = CW rot 
    };

}

//~~~~~~~~~~~~~~~~~~~~~~//
//These are our face-rotation mechanisms. Let's give it up for our Boys in Green!

void quarterRotate(string rotation,  int numRotations){
    //We're now rotating the faces; rotating the major face is the job of a separate function
    var index; //for executing baseRotation()

    var tRbL = [0, 0, 0, 0, 0]; //rotational order; the array will store which faces contact the Major Rotational Face CW (Top, Right, Bot, Left)
                //Swapping Right and Left indexes will switch make it CCW 

    var rot = split(rotation, "");
    var face = rot[0];
    println(face);
    var isPrime;
    if(rot[1] == "'"){
        isPrime = true;
    } else {
        isPrime = false;
    }
    println(isPrime);

    if(face == "U" || face == "u" || face == "d" || face == "D"){
        tRbL[1] = 4; //Both faces have 'Right' on their right and 'Left' on their left. What a coincidence! /s
        tRbL[3] = 5;
        if(face == "U" || face == "u"){
            tRbL[0] = 2;
            tRbL[2] = 3;
        } else { //D
            tRbL[0] = 3;
            tRbL[2] = 2;
        }

    } else { //F, B, R, || L
        tRbL[0] = 0;
        tRbL[2] = 1;
        if(face == "F" || face == "f"){
            tRbL[1] = 5;
            tRbL[3] = 4;
        }
        if(face == "B" || face == "b"){
            tRbL[1] = 4;
            tRbL[3] = 5;
        }
        if(face == "R" || face == "r"){   
            tRbL[1] = 2;
            tRbL[3] = 3;
        }
        if(face == "L" || face == "l"){
            tRbL[1] = 3;
            tRbL[3] = 2;
        }
    }

    for(i = 0; i<=4; i++){ //debugging
        println(tRbL[i]);
    }
    
    //We're now oriented in space relative to the other faces. Now we need the order in which the faces will rotate
    var relSideOrder = ["", "", "", "", ""]; //Array which'll place the order in which the relative sides of minor faces will be overwritten
   
    if(face == "U" || face == "u"){
        relSideOrder[0] = "top";
        relSideOrder[1] = "t";
        relSideOrder[2] = "t";
        relSideOrder[3] = "t";

        index = 0;
    } else if(face == "D" || face == "d"){
        relSideOrder[0] = "bot";
        relSideOrder[1] = "b";
        relSideOrder[2] = "b";
        relSideOrder[3] = "b";

        index = 1;
    } else if(face == "R" || face == "r"){
        relSideOrder[0] = "right";
        relSideOrder[1] = "r";
        relSideOrder[2] = "r";
        relSideOrder[3] = "l";

        index = 4;
    } else if(face == "L" || face == "l"){
        relSideOrder[0] = "l";
        relSideOrder[1] = "r";
        relSideOrder[2] = "l";
        relSideOrder[3] = "l";

        index = 5;
    } else if(face == "F" || face == "f"){
        relSideOrder[0] = "bot";
        relSideOrder[1] = "r";
        relSideOrder[2] = "t";
        relSideOrder[3] = "l";

        index = 2;
    } else if(face == "B" || face == "b"){
        relSideOrder[0] = "top";
        relSideOrder[1] = "r";
        relSideOrder[2] = "b";
        relSideOrder[3] = "l";

        index = 3;
    } else {
        println("Invalid input");
    }

    println("Yo!");
    for(i = 0; i<=3; i++){
        println(relSideOrder[i]);
    }

    if(isPrime == true){
        println("a pieca de pasta");
        tRbL[4] = tRbL[1];
        tRbL[1] = tRbL[3]; //Switching left and right movement order turns CW => CCW
        tRbL[3] = tRbL[4];
        relSideOrder[4] = relSideOrder[1];
        relSideOrder[1] = relSideOrder[3]; //Same with the relative sides, whose orientations change as well
        relSideOrder[3] = relSideOrder[4];
    }
    tRbL[4] = 6; //Our final index will be the 'helper' array
    relSideOrder[4] = relSideOrder[0]; //Our final side will also be our first

    baseRotation(index, !isPrime, numRotations);

    //Now, let's get started
    
    for(; numRotations >= 1; numRotations--){   
        relSideCopy(tRbL[0], relSideOrder[0], 6, relSideOrder[0]); // ex: Right side of Top Face is copied to Right side of Nth Face
        
        for(var i = 0; i <= 3; i++){
            relSideCopy(tRbL[i+1], relSideOrder[i+1], tRbL[i], relSideOrder[i]);                    
        }
    };


}


void relSideCopy(face1, side1, face2, side2){
    //We'll copy the values of face1's side1 to face2's side2
    //e.g. the top of one face will be copied to the right of another face

    //top is 2 1 0, right 4 3 2, bottom 6 5 4, left 0 7 6
    //set a var w/ topmost index, then iterate down as copying down

    var maxInd = [0, 0];
    println(face2);
    window.tessaract[face1][8] = window.tessaract[face1][0];
    window.tessaract[face2][8] = window.tessaract[face2][0];

    for(i = 0; i <= 1; i++){ //Setup max indexes for both faces (accessing side1 & side2)
        if(arguments[(2*i)+1] == "top" || arguments[(2*i)+1] == "t"){
            maxInd[i] = 2;
        }
        if(arguments[(2*i)+1] == "right" || arguments[(2*i)+1] == "r"){
            maxInd[i] = 4;
        }
        if(arguments[(2*i)+1] == "bot" || arguments[(2*i)+1] == "b"){
            maxInd[i] = 6;
        }
        if(arguments[(2*i)+1] == "left" || arguments[(2*i)+1] == "l"){
            maxInd[i] = 8; //and herein lies the reason why we have pos 8 as a stand-in for 0
        }
    };

    for(i = 0; i <= 2; i++){ //in sets of 3
        window.tessaract[face2][maxInd[1] - i] = window.tessaract[face1][maxInd[0] - i]; //Do the deed
    };

    if(maxInd[1] == 8){ //i.e. if we overwrote pos 8, we need to adjust pos 0 accordingly
      window.tessaract[face2][0] = window.tessaract[face2][8]; //NOTE: When we changed pos 8, since 8 and 0 represent the same value, we need to reassert the equality
    };
}

void baseRotation(int index, bool cw, int rotations){
    //This'll 'rotate' values in a face (indicated by Index) clockwise, but /only on the indicated face/ w/o correcting the others
    for(; rotations >= 1; rotations--){

        for(i = 0; i <= 7; i++){  //'helper' array copying current array completely for an original, unrotated copy
            window.tessaract[6][i] = window.tessaract[index][i];
        }

        for(i = 7; i >= 0 && cw == true; i--){ //CW Rotation
            if(i < 2){
                window.tessaract[index][i] = window.tessaract[6][i+6];
            } else {
                window.tessaract[index][i] = window.tessaract[index][i-2]; /*this whole 'moving and copying' thing we've got going on here 
                                                                            reminds me of the wonderfully confusing world of DNA synthesis
                                                                            The DNA's synthesized in one direction, but reads in the opposite.
                                                                            We've got a similar case right here. We ~read~ CCW, but we change the values
                                                                            CW. Confused? I am, too. Let's hope this works*/
            }
        }

        for(i = 0; i <= 7 && cw == false; i++){ //CCW Rotation
            if(i > 5){
                window.tessaract[index][i] = window.tessaract[6][i-6];
            } else {
                window.tessaract[index][i] = window.tessaract[index][i+2];
            };
        }

    };

}

//~~~~~~~~~~~~~~~~~~~//
//From here on, we've got our Tessaract Renderer

void drawFace(faceRef, dir, centerX, centerY)
{
    // We'll end up with first an unchanged center tile, then ultimately a 3x3 tile (200px by 200px) grid
    // dir will be our direction; 0 starts from top left, 1 starts from top right, 2 from bottom right, and 3 from bottom left 

    locSize = window.tileSize; //I'm a tad too lazy to write it all out.

    int index = 0; //for use in Array reference; dictates the position (0 is top left, continue clockwise)

    var colorFill = sheLovesMeNot(faceRef);
    fill(colorFill[0], colorFill[1], colorFill[2]);
    rect(centerX, centerY, locSize, locSize); // Face Center

    cyclicLoop: //the label's used in the rotation mechanic; when the label's broken, all tiles have been drawn
    for (int rev; rev<=1; rev++){
        if(dir == 0 || index != 0){ //Here, we're looking for our 'starting point' to paint clockwise; '0' is top left, cont' CW
            //if index != 0, then we've already started painting, and we no longer need to find a starting pt
            for (int x = -1; x <= 1; x++){ //Top, clockwise; 0, 1, 2 are drawn

                if(x == 1 && dir == 1 && rev == 1){ //just before drawing tile 2
                //If we're on our second revolution, and we started farther down the line, we need to break before overwriting a point
                //if we started at dir = 1, drawing a tile at index = 8 would not be index = 2; i.e. we break before overwriting ^^
                    break cyclicLoop;
                }
                colorFill = sheLovesMeNot(window.tessaract[faceRef][index]); //accessing UP face if 0 and so on, setup RGB
                fill(colorFill[0], colorFill[1], colorFill[2]); //Set fill color. Don't forget it, again. Side Note: YoU forgot it. Again. /a g a i n/
                rect(centerX + ((10+locSize)*x), centerY - (10+locSize), locSize, locSize);
                index++;

            }; 
            index--; //Take index one step back, for overlapping tiles; for use with labels to incorporate direction
        }
        
        if(dir == 1 || index != 0){
            for (int y = 1; y>=-1; y--){ //Right, overlapping top by one tile; 2, 3, 4 are drawn
            
                if(y == -1 && dir == 2 && rev == 1){
                    break cyclicLoop;
                }
                colorFill = sheLovesMeNot(window.tessaract[faceRef][index]);
                fill(colorFill[0], colorFill[1], colorFill[2]);
                rect(centerX + (10+locSize), centerY - ((10+locSize)*y), locSize, locSize);
                index++;

            }
            index--;
        }

        if(dir == 2 || index != 0){
            for (int x = 1; x>=-1; x--){ //Bottom, overlaping Right; 4, 5, 6 are drawn

                if(x == -1 && dir == 3 && rev == 1){
                    break cyclicLoop;
                }
                colorFill = sheLovesMeNot(window.tessaract[faceRef][index]);
                fill(colorFill[0], colorFill[1], colorFill[2]);
                rect(centerX + ((10+locSize)*x), centerY + ((10+locSize)), locSize, locSize);
                index++;

            }
            index--;
        }

        if(dir == 3 || index != 0){
            for (int y = -1; y<=1; y++){ //Left, overlapping Bottom; 6, 7, 0 are drawn

                if(y == 1 && dir == 0){ //end of first loop and started at UP; break before overwriting first tile
                    break cyclicLoop;
                }
                colorFill = sheLovesMeNot(window.tessaract[faceRef][index]);
                fill(colorFill[0], colorFill[1], colorFill[2]);
                rect(centerX - (10+locSize), centerY - ((10+locSize)*y), locSize, locSize);
                index++;

            }
            index--;
        }
       
    }
}

void sheLovesMeNot(colour)
{
    // We'll input a 'colour' string and return an array with the appropriate RGB values as an array
    // i.e. return [r, g, b]

    if (colour == "Y" || colour == 0){ //NOTE: When comparing strings, use '==' instead of '='
        return [246, 255, 0]; // Yellow RGB
    }
    if (colour == "O" || colour == 2){ //The numerical option corresponds with the starting faces, in the setup of the tessaract[][]
        return [255, 166, 0]; // Orange
    }
    if (colour == "B" || colour == 4) {
        return [0, 47, 255];
    }
    if (colour == "R" || colour == 3) {
        return [204, 21, 21];
    }
    if (colour == "G" || colour == 5) {
        return [10, 204, 0];
    }
    if (colour == "W" || colour == 1) {
        return [235, 235, 235];
    } 
    if (colour == "A"){
        return [217, 0, 255];
    } else {
        return [0, 0, 0]; //for debugging
        println("Somethin' ain't right, Chief");
    }

}
