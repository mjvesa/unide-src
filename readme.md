uDesigner
=========
A microscoping visual designer for attribute trees.

The attribute tree is presented as a textual tree (outline) and as a visual
representation. The current visual representation is based on Web Components.

The design of this tool follows the suckless philosophy. The user is assumed
to be capable of modifying the source to configure the tool.

Siplicity of the design
-----------------------

 * Scanning for elements is done using a small shell script and needs only
   be done after installing or removing components
 * All the elements are imported in the application
 * No web components are used to construct the UI to eliminate conflicts and
   to make the us of an iframe unnecessary
 * Designs contain only the tree structure of the design. The structure
   is stored in a linear format that can be interpreted as various forms
   of trees (DOM, S-expressions, JSON, imperative tree creation)
 * Attributes are edited as texts. First word of each line is the attribute
   and the remaining words the value.


 


