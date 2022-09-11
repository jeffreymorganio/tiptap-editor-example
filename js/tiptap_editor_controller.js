import { Editor } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"

export default class TipTapEditorController {
  constructor(editorID, initialText) {
    this.buttonElements = {}
    this.createEditor(editorID, initialText)
    this.addButtonListeners()
  }

  createEditor(editorID, initialText) {
    this.textEditorElement = document.querySelector(`[data-text-editor="${editorID}"]`)
    this.editorElement = this.textEditorElement.querySelector("[data-editor]")
    this.editor = new Editor({
      element: this.editorElement,
      extensions: [
        StarterKit,
      ],
      onTransaction: () => this.updateButtons(),
      content: `<p>${initialText}</p>`,
    })
  }

  addButtonListeners() {
    this.addButtonListener("heading-1",   chain => { return chain.toggleHeading({ level: 1 }) })
    this.addButtonListener("heading-2",   chain => { return chain.toggleHeading({ level: 2 }) })
    this.addButtonListener("heading-3",   chain => { return chain.toggleHeading({ level: 3 }) })
    this.addButtonListener("bold",        chain => { return chain.toggleBold() })
    this.addButtonListener("italic",      chain => { return chain.toggleItalic() })
    this.addButtonListener("strike",      chain => { return chain.toggleStrike() })
    this.addButtonListener("bulletList",  chain => { return chain.toggleBulletList() })
    this.addButtonListener("orderedList", chain => { return chain.toggleOrderedList() })
    this.addButtonListener("undo",        chain => { return chain.undo() })
    this.addButtonListener("redo",        chain => { return chain.redo() })
  }

  addButtonListener(dataAttribute, command, isToggleable=false) {
    const buttonElements = this.textEditorElement.querySelectorAll(`[data-${dataAttribute}]`)
    buttonElements.forEach(buttonElement => {
      this.buttonElements[dataAttribute] = buttonElement
      buttonElement.addEventListener("click", event => {
        command(this.editor.chain().focus()).run()
        this.updateButtons()
      })
    })
  }

  updateButtons() {
    this.updateHeadingButtons()
    this.updateStyleButtons()
  }

  updateHeadingButtons() {
    [1, 2, 3].forEach(level => {
      const dataAttribute = `heading-${level}`
      const buttonOn = this.editor.isActive("heading", { level: level })
      this.updateButtonState(dataAttribute, buttonOn)
    })
  }

  updateStyleButtons() {
    ["bold", "italic", "strike", "bulletList", "orderedList"].forEach(dataAttribute => {
      const buttonOn = this.editor.isActive(dataAttribute)
      this.updateButtonState(dataAttribute, buttonOn)
    })
  }

  updateButtonState(dataAttribute, buttonOn) {
    const buttonElement = this.buttonElements[dataAttribute]
    if (buttonOn) {
      this.buttonOn(buttonElement)
    } else {
      this.buttonOff(buttonElement)
    }
  }

  buttonOn(buttonElement) {
    buttonElement.classList.remove("bg-white")
    buttonElement.classList.remove("text-gray-900")
    buttonElement.classList.add("bg-gray-700")
    buttonElement.classList.add("text-white")
  }

  buttonOff(buttonElement) {
    buttonElement.classList.add("bg-white")
    buttonElement.classList.add("text-gray-900")
    buttonElement.classList.remove("bg-gray-700")
    buttonElement.classList.remove("text-white")
  }
}
