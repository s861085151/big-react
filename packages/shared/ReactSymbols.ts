const supporSysbol = typeof Symbol === 'function' && Symbol.for;

export const REACT_ELEMENT_TYPE = supporSysbol
	? Symbol.for('react.element')
	: 0xeac7;
