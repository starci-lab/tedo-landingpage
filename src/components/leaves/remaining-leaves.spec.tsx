// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { AttachmentLink } from "./AttachmentLink"
import { Placeholder } from "./Placeholder"
import { SelectedFileChip } from "./SelectedFileChip"
import { Wordmark } from "./Wordmark"
import { SkyBackground } from "../sky-background"
import { Hero3DVisual } from "../hero-3d-visual"

describe("remaining interactive leaves", () => {
    it("renders image/file attachment branches and omits unresolved links", () => {
        const { container, rerender } = render(<AttachmentLink props={{ kind: "file", href: "/doc.pdf", fileName: "doc.pdf", sizeLabel: "2 KB" }} />)
        expect(container.querySelector("[data-kind='file']")).toBeTruthy()
        rerender(<AttachmentLink props={{ kind: "image", href: "/image.png", fileName: "image.png" }} />)
        expect(container.querySelector("[data-kind='image']")).toBeTruthy()
        rerender(<AttachmentLink props={{ kind: "file", fileName: "missing" }} />)
        expect(container.querySelector("[data-component='AttachmentLink']")).toBeNull()
    })

    it("invokes the selected-file removal callback", () => {
        const onRemove = vi.fn()
        const { container } = render(<SelectedFileChip props={{ fileName: "brief.pdf", removeLabel: "Remove brief.pdf" }} on={{ onRemove }} />)
        fireEvent.click(container.querySelector("button") as HTMLButtonElement)
        expect(onRemove).toHaveBeenCalledTimes(1)
    })

    it("maps placeholder size, tone and alignment data", () => {
        const { container } = render(<Placeholder props={{ height: "xl", width: "wide", tone: "brand", align: "end" }} />)
        const classes = container.firstElementChild?.getAttribute("class") ?? ""
        expect(classes).toContain("h-24")
        expect(classes).toContain("w-52")
        expect(classes).toContain("bg-brand-soft")
        expect(classes).toContain("ml-auto")
    })

    it("renders the supplied original vector wordmark in either surface context", () => {
        const { container } = render(<Wordmark />)
        expect(container.querySelector("img")?.getAttribute("src")).toContain("tedo-original.svg")
        expect(container.querySelector("[data-on-dark='false']")).toBeTruthy()
        const dark = render(<Wordmark onDark />)
        expect(dark.container.querySelector("[data-on-dark='true']")).toBeTruthy()
        dark.unmount()
    })
})


describe("remaining visual components", () => {
    it("renders the sky and 3D visual shells", () => {
        expect(renderToStaticMarkup(<SkyBackground />)).toContain("tedo-sky")
        expect(renderToStaticMarkup(<Hero3DVisual />)).toContain("hero-3d-frame")
    })

    it("updates and resets hero pointer parallax", () => {
        const { container } = render(<Hero3DVisual />)
        const frame = container.querySelector(".hero-3d-frame") as HTMLElement
        vi.spyOn(frame, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON: () => ({}) })
        fireEvent.pointerMove(frame, { clientX: 150, clientY: 75 })
        expect(frame.style.getPropertyValue("--px")).toBe("0.250")
        expect(frame.style.getPropertyValue("--py")).toBe("0.250")
        fireEvent.pointerLeave(frame)
        expect(frame.style.getPropertyValue("--px")).toBe("0")
        expect(frame.style.getPropertyValue("--py")).toBe("0")
    })
})
