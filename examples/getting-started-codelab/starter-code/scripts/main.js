/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
(function () {
  let currentButton;

  function handlePlay(event) {
    // load workspace for a button
    loadWorkspace(event.target);

    // Grab the blocks workspace and append a play function at the end
    let code = javascript.javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
    code += 'MusicMaker.play();';

    // use eval() to execute the blockly code, wrap in try catch to log errors
    try {
      eval(code);
    } catch (error) {
      console.log(error);
    }
  }

  // associate blockly workspace with a particular button
  function save(button) {
    button.blocklySave = Blockly.serialization.workspaces.save(
      Blockly.getMainWorkspace());
  }

  // loads the saved workspace for a particular button
  function loadWorkspace(button) {
    const workspace = Blockly.getMainWorkspace();
    if (button.blocklySave) {
      Blockly.serialization.workspaces.load(button.blocklySave, workspace);
    } else {
      workspace.clear();
    }
  }

  function handleSave() {
    document.body.setAttribute('mode', 'edit');
    save(currentButton);
  }

  function enableEditMode() {
    document.body.setAttribute('mode', 'edit');
    document.querySelectorAll('.button').forEach((btn) => {
      btn.removeEventListener('click', handlePlay);
      btn.addEventListener('click', enableBlocklyMode);
    });
  }

  function enableMakerMode() {
    document.body.setAttribute('mode', 'maker');
    document.querySelectorAll('.button').forEach((btn) => {
      btn.addEventListener('click', handlePlay);
      btn.removeEventListener('click', enableBlocklyMode);
    });
  }

  function enableBlocklyMode(e) {
    document.body.setAttribute('mode', 'blockly');
    currentButton = e.target;
    loadWorkspace(currentButton);
  }

  document.querySelector('#edit').addEventListener('click', enableEditMode);
  document.querySelector('#done').addEventListener('click', enableMakerMode);
  document.querySelector('#save').addEventListener('click', handleSave);

  // Create Toolbox to grab blocks from
  enableMakerMode();
  const toolbox = {
    'kind': 'flyoutToolbox',
    'contents': [
      {
        'kind': 'block',
        'type': 'controls_repeat_ext',
        'inputs': {
          'TIMES': {
            'shadow': {
              'type': 'math_number',
              'fields': {
                'NUM': 5
              }
            }
          }
        }
      },
      {
        'kind': 'block',
        'type': 'play_sound'
      }
    ]
  };

  // Inject this into a div in index.html
  Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    scrollbars: false,
    horizontalLayout: true,
    toolboxPosition: "end",
  });
  
})();
