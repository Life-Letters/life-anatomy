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
		scene: 'be=ABC',							// The BioDigital scene (see human.biodigital.com/ for details)
    poster: 'image.png',					// Poster image, shown whilst loading
    camInit: {										// Initial camera position when first revealed
      position: {x:, y:, z:}, target: {...}, up: {...},
    camA: {...},									// Camera oscillates between A and B
    camB: {...},
    camCenter: {...} 							// Camera position when first entering the interaction mode.
	```


## Build & development

Run `grunt` for building and `grunt serve` for preview.

