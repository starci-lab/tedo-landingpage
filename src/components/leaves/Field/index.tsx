"use client"

import { FieldError, Input, Label, TextField } from "@heroui/react"
import type { LeafProps } from "@/components/grammar/props"

/**
 * LEAF - `Field`: one labelled single-line answer inside a bounded form surface -
 * a name, an email, a phone number, a company.
 *
 * COMPOSES `TextField` + `Label` + `Input` + `FieldError`, the same anatomy the
 * real contact form already hand-assembles inline. This leaf closes that anatomy
 * behind the props fence so every future form reaches for one `Field`, not four
 * separate vendor imports repeated at every call site.
 *
 * `Input` USES HERO'S `secondary` VARIANT, always. Field sits inside a bounded
 * form surface (a card), and the default variant draws a competing field surface
 * of its own - two borders reading as two separate boxes instead of one.
 *
 * THE LABEL IS TEXT ONLY. No icon is inferred from `type` - a decorative glyph
 * beside every field would say nothing a screen reader or a sighted reader does
 * not already get from the word itself. An icon belongs only to a control with
 * its own action, such as password visibility, and this leaf draws no such
 * control.
 */

/** The native input kinds a marketing lead form actually asks for. */
export type FieldType = "text" | "email" | "tel"

/** What this leaf draws. A `type`, not an `interface` - only an alias satisfies the data fence. */
export type FieldData = {
    /** The form field name - what the value travels under. */
    readonly name: string
    /** The already-resolved label text. */
    readonly label: string
    /** Which native input kind this collects. */
    readonly type?: FieldType
    /** Hint text shown inside the empty control. */
    readonly placeholder?: string
    /** The current value. Controlled - this leaf holds no state of its own. */
    readonly value?: string
    /** Browser autofill hint, e.g. `"email"`, `"tel"`, `"organization"`. */
    readonly autoComplete?: string
    /** Whether a value must be entered before the form can submit. */
    readonly required?: boolean
    /** Whether the current value failed validation. */
    readonly invalid?: boolean
    /** The already-resolved validation message, shown only while `invalid`. */
    readonly errorMessage?: string
}

/** What this leaf does. One edit, reported as the resolved string. */
export type FieldActions = {
    readonly onChange?: (value: string) => void
}

/** Props for {@link Field}. Three fixed slots, no fourth - see {@link LeafProps}. */
export type FieldProps = LeafProps<FieldData, FieldActions>

/**
 * Draw one labelled single-line answer.
 *
 * @param input - {@link FieldProps}
 */
export const Field = ({ props, on }: FieldProps) => {
    return (
        <TextField
            data-tier="leaf"
            data-component="Field"
            name={props.name}
            type={props.type ?? "text"}
            value={props.value}
            onChange={on?.onChange}
            autoComplete={props.autoComplete}
            isRequired={props.required}
            isInvalid={props.invalid}
        >
            <Label>{props.label}</Label>
            <Input variant="secondary" placeholder={props.placeholder} />
            {props.errorMessage ? <FieldError>{props.errorMessage}</FieldError> : null}
        </TextField>
    )
}

/** Source-level tier marker - lets a gate read the tier without guessing from the folder path. */
export const meta = { shape: "leaf", world: "pure" } as const
