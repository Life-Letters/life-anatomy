# Anatomy module and editor

A directive for embedding and interacting with a 3D anatomy scene. The project utilises the [BioDigital](http://biodigital.com/) anatomy system and provides further features.

The 3D scene can operates in one of two modes. In the *idle* mode, the model oscillates between two chosen camera positions. The user can enter the *interactive* mode by clicking, which allows them to manipulate the position and orientation of the the model.

The project includes an editor to configure the scene's settings and camera positions.


-----

## Key Project Tech

- Angular: provides app framework. Designed to be used as a module.
- Grunt: used to launch a local `LiveReload` server and build the `dist` package.
- [BioDigital](http://biodigital.com/): provides a collection of anatomy models. The [anatomy browser](http://human.biodigital.com/) lets you explore different scenes. A chosen scene can then be used by copying its scene name, which can be viewed when exporting the scene.

-----

## Environments and Config

There are no remote environments for the project as the project is intended to be imported into another Angular project. 


-----

## Getting Started (How to Develop)

To run the editor:

- Install dependencies via `bower install` and `npm install`
- Run LiveReload server via `grunt serve`

-----

## Publishing and C.I (How to Deploy)

Publishing the module via Bower:

- Versions are marked using Git tags, e.g. `git tag -v0.1.0`. The project follows SemVer.

-----

## Importing (How to use in another project)


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

  The `scene` attribute can have the following values:

  ```
  {
    // The BioDigital scene (see below)
    scene: 'be=ABC',

    // Poster image, shown whilst loading
    poster: 'image.png',

    // Camera positions when oscillating in idle mode.
    camA: {
      position: {x:, y:, z:}, 
      target: {x:, y:, z:},
      up: {x:, y:, z:}
    },
    camB: {...},

    // Camera position when entering the interactive mode
    camCenter: {...},

    // The chapter to use of an existing tour (optional)
    tourChapter: 2
  }

  ```

  The `camera` attribute provides a way to set the initial camera position and watch subsequent changes. Whilst the scene is in the *idle* mode, the camera will be `null`.

-----

## Resources 

- Architecture docs: available on [Google Drive](https://drive.google.com/open?id=0B7lD4DpFazFzU055YmNuS1FqYzg).
- Issue tracking: via [Github issues](https://github.com/Life-Letters/life-anatomy/issues). Use the same tag convention as used by the [clinic-app](https://github.com/Life-Letters/clinic-app).


-----

## Related Apps/Libraries/Modules

- [life-education](https://github.com/Life-Letters/life-education): the system/logic for displaying the educational content. It uses the `life-anatomy` module.

-----


## Major Changelog

- 0.4.0
  - Supports two modes: idle and interactive.
  - Oscillates between two positions when idle.
  - Reports all interaction back via a `camera` object.
