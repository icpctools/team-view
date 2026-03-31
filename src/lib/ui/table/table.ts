import type { Component } from 'svelte';

/**
 * A table column.
 */
export interface Column<Type> {
	/**
	 * The column title.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly title: string | Component<any>;

	/**
	 * Properties to pass to the title renderer component.
	 * These properties will be spread onto the component, allowing you
	 * to renderer title components with any property.
	 */
	readonly titleProps?: Record<string, unknown>;

	/**
	 * Title alignment, one of 'left', 'center', 'right', or 'stretch',
	 *
	 * Defaults to column alignment.
	 */
	readonly titleAlign?: 'left' | 'center' | 'right' | 'stretch';

	/**
	 * Column alignment, one of 'left', 'center', 'right', or 'stretch',
	 *
	 * Defaults to 'left' alignment.
	 */
	readonly align?: 'left' | 'center' | 'right' | 'stretch';

	/**
	 * Column width, typically in pixels or fractional units (fr).
	 *
	 * Defaults to '1fr'.
	 */
	readonly width?: string;

	/**
	 * Svelte component, renderer for each cell in the column.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly renderer: Component<any>;

	/**
	 * Properties to pass to the renderer component.
	 * These properties will be spread onto the component, allowing you
	 * to renderer components with any property.
	 */
	readonly rendererProps?: (object: Type, rowIndex: number) => Record<string, unknown>;

	/**
	 * Set a comparator used to sort the data by the values in this column.
	 */
	readonly comparator?: (object1: Type, object2: Type) => number;

	/**
	 * The 'natural' or initial sort direction. Most columns are
	 * naturally sorted in ascending order and do not need to
	 * specify this value - e.g. names are sorted alphabetically.
	 *
	 * Columns that are naturally sorted in descending order -
	 * e.g. file sizes or 'number of children' by biggest first -
	 * can set this value to change the initial sort direction.
	 *
	 * Defaults to 'ascending'.
	 */
	readonly initialOrder?: 'ascending' | 'descending';

	/**
	 * By default, columns are limited to rendering within their
	 * own cell to stop long or extraneous content (e.g. long
	 * user-provided names) from interfering with other columns.
	 * More advanced column renderers that need to render outside
	 * of their cells (e.g. with popup menus or tooltips) can use
	 * this property to allow this behaviour.
	 *
	 * Defaults to 'false'.
	 */
	readonly overflow?: boolean;
}
