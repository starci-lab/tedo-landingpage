"use client"

import { Label, TextArea, TextField } from "@heroui/react"
import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `TextAreaField`: one labelled multi-line answer inside a bounded form
 * surface - a project message, a free-text prompt.
 *
 * COMPOSES `TextField` + `Label` + `TextArea`, the same anatomy the real contact
 * form already hand-assembles inline for its message field. This leaf closes
 * that anatomy behind the props fence.
 */

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type TextAreaFieldData = {
    /** The form field name - what the value travels under. */
    readonly name: string
    /** The already-resolved label text. */
    readonly label: string
    /** Hint text shown inside the empty control. */
    readonly placeholder?: string
    /** The current value. Controlled - this leaf holds no state of its own. */
    readonly value?: string
    /** How many text rows the control opens at, before it grows. */
    readonly rows?: number
    /** Whether a value must be entered before the form can submit. */
    readonly required?: boolean
}

/** What this leaf does. One edit, reported as the resolved string. */
export type TextAreaFieldActions = {
    readonly onChange?: (value: string) => void
}

/** Props for {@link TextAreaField}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type TextAreaFieldProps = LeafProps<TextAreaFieldData, TextAreaFieldActions>

/**
 * Draw one labelled multi-line answer.
 *
 * @param input - {@link TextAreaFieldProps}
 */
export const TextAreaField = ({ props, on }: TextAreaFieldProps) => {
    return (
        <TextField
            data-tier="leaf"
            data-component="TextAreaField"
            name={props.name}
            value={props.value}
            onChange={on?.onChange}
            isRequired={props.required}
        >
            <Label>{props.label}</Label>
            <TextArea rows={props.rows ?? 4} placeholder={props.placeholder} />
        </TextField>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
