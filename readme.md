UniDe
=========
Univesal Designer for UI templates.

The design of this tool follows the suckless philosophy. The user is assumed
to be capable of modifying the source to configure the tool.

To run the project, clone the repository, `npm install` the damned thing and
finally recite this ancient spell: `polymer serve --npm`

The current lofty goal
----------------------
UniDe is an universal UI designer that is targeted as a prototyping tool to 
lower the bar for using Vaadin Components.

The user should be able to produce UIs, add basic navigation and finally export the
result to the platform of choice. Exportable platforms should include all
platforms supported by Vaadin Components and maybe some more exotic ones.


Exporting
---------
Export will come in two tiers: First tier export will contain a full project
ready for importing into an IDE. Second tier only exports the views as
components of the target platform and supplies instructions on how to
include the views in the project. 

