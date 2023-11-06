<script lang="ts">
    import Toastify from "toastify-js";

    let color = {
        color: "#222222" as string,
        text: "222222" as string,
        invert_color: "#dddddd" as string,
        is_light: false as boolean,
        is_dark: true as boolean,
    };

    const onInputColorPicker = (e) => {
        // console.log(e);
        const _value = e.target.value;
        applyColor(_value);
    };

    const onInputColorText = (e) => {
        // console.log(e);
        const _text_value: string = e.target.value;

        applyColor(_text_value);
    };

    const applyColor = (value: string) => {
        if (isColor(value)) {
            const _color_value = value;
            color.color = _color_value;
            color.text = _color_value.replace(/#/g, "");
            color.invert_color = invertColor(_color_value);
        }
    };

    const isColor = (string: string) => {
        return string.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) !== null;
    };

    const copyColor = async () => {
        // console.log("way");
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(color.color);
            Toastify({
                text: `Copied ${color.color}`,
                duration: 20000,
                //   destination: "https://github.com/apvarun/toastify-js",
                //   newWindow: true,
                // close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                //   stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    // background: `linear-gradient(to right, #00b09b, #96c93d)`,
                    background: `linear-gradient(to right, ${color.color},${color.invert_color})`,
                    border: "solid 1px #" + color.is_dark ? "fff" : "222",
                },
                //   onClick: function(){} // Callback after click
            }).showToast();
        }
    };

    const invertColor = (color_value: string) => {
        const max_color = 0xff;
        const _splits = color_value.replace(/#/g, "").split("");

        const red = _splits[0] + _splits[1];
        const green = _splits[2] + _splits[3];
        const blue = _splits[4] + _splits[5];

        const zx_red = parseInt(red, 16);
        const zx_green = parseInt(green, 16);
        const zx_blue = parseInt(blue, 16);

        const sum_color = zx_red + zx_green + zx_blue;
        color.is_dark = sum_color < (255 * 3) / 2;
        color.is_light = sum_color > (255 * 3) / 2;

        const di_red = max_color - zx_red;
        const di_green = max_color - zx_green;
        const di_blue = max_color - zx_blue;

        return (
            "#" + di_red.toString() + di_green.toString() + di_blue.toString()
        );
    };
    // #
</script>

<div class="page fl cl" style="background-color: {color.color}">
    <div class="abs-1 fl j-c g-2">
        <b class="color-code-preview">{color.color}</b>
        <button type="button" class="copy-btn mt-1" on:click={copyColor}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="36"
                viewBox="0 -960 960 960"
                width="36"
                fill="#eee"
            >
                <path
                    d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"
                /></svg
            >
        </button>
    </div>
    <div class="abs-2 fl j-c">
        <div class="p-5 main-board">
            <div class="fl j-c g-1 color-control-card p-2">
                <b class="sharp">#</b>
                <input
                    type="text"
                    value={color.text}
                    on:input={onInputColorText}
                />
                <input
                    type="color"
                    value={color.color}
                    on:input={onInputColorPicker}
                />
            </div>
        </div>
    </div>
    <aside class="aside-board p-3 pl-0">
        <ul class="my-0">
            <li>指定色：{color.color}</li>
            <li>反対色：{color.invert_color}</li>
        </ul>
    </aside>
</div>

<style lang="scss" scoped>
    .page {
        width: 100vw;
        height: 100vh;

        .abs-1 {
            position: absolute;
            top: 10%;
            left: 0;
            right: 0;
            z-index: 2;
        }

        .color-code-preview {
            font-size: 4rem;
            color: #fff;
            // filter: drop-shadow(0 0 0.75rem #eee);
            // text-shadow: 0px 0px 10px #aeaeae;
        }

        .abs-2 {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 1;
            .main-board {
                border-radius: 0.3em;
                background-color: rgba($color: #fff, $alpha: 0.5);
            }
        }

        .color-control-card {
            // width: 300px;
            // height: 200px;
            background-color: #fff;
            .sharp {
                font-size: 2rem;
            }
        }

        input {
            outline: none;
            border: solid 1px gray;
            border-radius: 0.15em;
            height: 50px;

            &[type="text"] {
                font-size: 2rem;
                width: 200px;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
            }
            &[type="color"] {
                width: 50px;
                cursor: pointer;
            }
        }

        .copy-btn {
            background: transparent;
            border: 1px solid #eee;
            color: #eee;
            border-radius: 0.3em;
            cursor: pointer;
        }

        .aside-board {
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 0 0 0 0.5rem;
            background-color: rgba($color: #fff, $alpha: 0.7);
        }
    }
</style>
