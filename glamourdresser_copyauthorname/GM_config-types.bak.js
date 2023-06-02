/* global GM_config */
GM_config.init({
  types: {
    selectWrapper: {
      default: null,
      toNode() {
        const { label, type, options } = this.settings;
        const { value, id, create } = this;
        const wrap = create("div", {
          className: "select-wrapper",
          id: `${this.configId}_field_${id}`,
          label: label || "<unknown>"
        });
        const select = create("select", {});

        function addLabel(pos, labelEl, parentNode, beforeEl) {
          if (!beforeEl) {
            beforeEl = parentNode.parentElement;
          }

          switch (pos) {
          case "right": case "below":
            if (pos === "below") {
              parentNode.insertAfter(create("br", {}));
            }

            parentNode.insertAfter(labelEl);
            break;
          default:
            if (pos === "above") {
              parentNode.insertBefore(create("br", {}), beforeEl);
            }

            parentNode.insertBefore(labelEl, beforeEl);
          }
        }

        const newLabel = label && type !== "button"
          ? create("label", {
            id: `${this.configId}_${id}_field_label`,
            for: `${this.configId}_field_${id}`,
            className: "field_label"
          }, label) : null;

        wrap.appendChild(select);
        this.node = wrap;

        for (let i = 0, len = options.length; i < len; ++i) {
          const option = options[i];
          select.appendChild(create("option", {
            value: option,
            selected: option === value
          }, option));
        }

        if (newLabel) {
          addLabel("left", newLabel, wrap);
        }

        return wrap;
      },
      toValue() {
        const { node } = this;
        return node.getElementsByTagName("select")[0][node.getElementsByTagName("select")[0].selectedIndex].value;
      },
      reset() {
        const { node, _default } = this;
        for (let i = 0, len = node.getElementsByTagName("select")[0].options.length; i < len; ++i) {
          if (node.getElementsByTagName("select")[0].options[i].textContent === _default) {
            node.getElementsByTagName("select")[0].selectedIndex = i;
          }
        }
      }
    }
  }
});
