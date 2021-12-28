# singer-node
Writes the Singer format from Python


## Dev notes

All objects should be immutable.

Data that transits should be defined as standard data models

We are stricter about 'null' than target-postgres --> may come back to bite us later, should be checked

We chose to base schema state on show create table request --> Not the cleanest but liek this we don't have to create temp table to compare


## Biron Notes

Difference with current system:
* To access deep nested children array we store index of array for each level instead of _parent_ and _root_
* children tables with 2 underscores `__` for more clarity 
* 'required' field is not used anymore: nullable is defined by types (["number", "null"]). PK are never nullable.
