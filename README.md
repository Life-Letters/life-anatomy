# BioDigital Anatomy

View and interact with the BioDigital system.

## Install

- Import the module:

  ```
  bower install git@github.com:Life-Letters/life-anatomy.git --save
  ```
  Add the Angular dependency: `life.anatomy`


- Add the BioDigital library:
  
  ```
  <script src="https://developer.biodigital.com/builds/api/2/human-api.min.js"></script>
  ```


- Add an anatomy element:

  ```
  <anatomy scene="scene" camera="camera"></anatomy>
  ```
  The scene can have the following values:
  ```
  {
  	// The BioDigital scene (see human.biodigital.com/ for details)
    scene: 'be=ABC',

    // Poster image, shown whilst loading
    poster: 'image.png',
    
    // Initial camera position when first revealed
    camInit: {position: {x:, y:, z:}, target: {...}, up: {...}},

    // Camera oscillates between A and B when not in interactive mode.
    camA: {...},
    camB: {...},

    // Camera position when first entering the interactive mode.
    camCenter: {...}
  }

  ```


## Build & development

Run `grunt` for building and `grunt serve` for preview.

