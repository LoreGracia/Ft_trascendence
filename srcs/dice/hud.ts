export function createHud(): { resultText: HTMLDivElement; rollButton: HTMLButtonElement } {
    const panel = document.createElement("div");
    panel.id = "hudPanel";

    const resultText = document.createElement("div");
    resultText.textContent = "Resultado: -";

    const rollButton = document.createElement("button");
    rollButton.id = "hudRollButton";
    rollButton.textContent = "Lanzar dado";

    panel.appendChild(resultText);
    panel.appendChild(rollButton);
    document.body.appendChild(panel);

    return { resultText, rollButton };
}

export function setResult(resultTextEl: HTMLDivElement, value: string) {
    resultTextEl.textContent = value;
}

export function setBusy(rollButtonEl: HTMLButtonElement, busy: boolean) {
    rollButtonEl.disabled = !!busy;
    rollButtonEl.textContent = busy ? "Tirando..." : "Lanzar dado";
}
