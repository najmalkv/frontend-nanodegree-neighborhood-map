## Frontend Nanodegree Neighborhood Map Project

This is my solution to the Neighborhood Map project of the frontend nanodegree from Udacity. The project requirement is to build a responsive website thats shows atleast 5 locations using markers on google maps in your neighborhood area. The name of the locations have to be displayed in a list that can used by the user to see more information on the location. Clicking on the marker should also display the same information.

In my solution the website displays restaurants in the area of edapally in the city of Cochin. I used the zomato API to get information on the restaurants in edapally. To display the map and markers I used the google maps API.


### Installation
To get the project running on your local machine firstly take a clone of this repo onto your local machine. Then `cd` into the root directory on your CLI tool(eg. CMD prompt or Terminal) and then run `npm install`. This will install all the node packages you require to run the project.

```
npm install
```

### How to Run

The project is equipped with a gulp build system. You can follow the below mentioned methods to run the website depending on the build you prefer.

 _Note:_ `cd` into the root folder on your CLI tool and then run the commands.

To run the devolopment build with auto reload use the following command:
```
gulp serve
```

To run the production build use the following command:
```
gulp serve:dist
```

### How to Build for production

To get the production build use the following command from the root folder:
```
gulp
```

This command will optimize the files and output it to the **dist** folder. Use the contents of this folder for your production hosting.

## LICENSE

MIT License

Copyright (c) 2017 Najmal K V

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.