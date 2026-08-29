"use client"

import { Label, ListBox, ListBoxItem, Select } from "@heroui/react"
import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `SelectField`: one labelled choice from a short, already-known list -
 * a preferred contact channel, a service category.
 *
 * COMPOSES `Select` + `Label` + `Select.Trigger/Value/Indicator` +
 * `Select.Popover` + `ListBox`/`ListBoxItem`, the same anatomy the real contact
 * form already hand-assembles inline for its service picker. This leaf closes
 * that anatomy behind the props fence.
 *
 * OPTIONS ARE PLAIN STRINGS, not objects with a separate id/label pair. Every
 * real call site this leaf has to serve - a channel name, a service name - is a
 * string that IS its own label; inventing an id/label split here would be a
 * shape no caller asked for.
 */

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type SelectFieldData = {
    /** The form field name - what the selection travels under. */
    readonly name: string
    /** The already-resolved label text. */
    readonly label: string
    /** The already-resolved choices, in the order they should list. */
    readonly options: ReadonlyArray<string>
    /** The current choice. Controlled - this leaf holds no state of its own. */
    readonly value?: string
    /** Whether a choice must be made before the form can submit. */
    readonly required?: boolean
}

/** What this leaf does. One choice, reported as the resolved string. */
export type SelectFieldActions = {
    readonly onChange?: (value: string) => void
}

/** Props for {@link SelectField}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type SelectFieldProps = LeafProps<SelectFieldData, SelectFieldActions>

/**
 * Draw one labelled choice from a short list.
 *
 * @param input - {@link SelectFieldProps}
 */
export const SelectField = ({ props, on }: SelectFieldProps) => {
    return (
        <Select
            data-tier="leaf"
            data-component="SelectField"
            name={props.name}
            value={props.value}
            isRequired={props.required}
            onChange={(value) => on?.onChange?.(String(value))}
        >
            <Label>{props.label}</Label>
            <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {props.options.map((option) => (
                        <ListBoxItem key={option} id={option}>
                            {option}
                        </ListBoxItem>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
