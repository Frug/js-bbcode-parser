JavaScript BBCode Parser
========================

This is a simple JavaScript BBCode parser module that returns html when fed BBCodes.

It's designed to be light-weight and allows you to easily add your own BBCodes with only basic JavaScript knowledge.

It was based initially on the Extendible BBCode Parser by Patrick Gillespie ( github @patorjk )
with help from the regexp [blogs of Steven Levithan](http://blog.stevenlevithan.com/) ( github @slevithan )


Usage
-----
Include your configuration file, which defines all the BBCodes you want to support, and all the valid color codes.
You can do this in your document head or at the bottom of your page.
`<script src="bbcode-config.js"></script>`
Below that, include the parser itself.
`<script src="bbcode-parser.js"></script>`

Call the parser with the following method
`var output = BBCodeParser.process("Your string");`


Configuration
-------------


License
-------
This project is released under The MIT License (MIT).