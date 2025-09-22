<script lang="ts">
    import Toastify from "toastify-js";

    let color = {
        color: "" as string,
        text: "" as string,
        invert_color: "" as string,
        is_light: false as boolean,
        is_dark: true as boolean,
        rgba: {
            r: 34,
            g: 34,
            b: 34,
            a: 1.0,
        },
    };

    let switcher = {
        alpha: false,
    };

    let history = {
        color: [] as string[],
    };

    let history_push_timer = 0;

    const COLOR_HISTORY_KEY = "ch";

    const onInputColorPicker = (e: any) => {
        // console.log(e);
        const _value = e.target.value;
        const _color = applyColor(_value, false);
        if (history_push_timer) clearTimeout(history_push_timer);
        history_push_timer = setTimeout(() => {
            registColorHistory(_color);
            history_push_timer = 0;
        }, 2000);
    };

    const onInputColorText = (e: any) => {
        // console.log(e);
        if (!e.target) return;
        const _text_value: string = e.target.value.toUpperCase();
        color.text = _text_value;

        applyColor(_text_value);
    };

    const onClickSelect = (e: any) => {
        e.target.select();
    };

    const applyColor = (value: string, history_push = true): string => {
        if (!isColor(value)) return "";

        let _color_value = value.toUpperCase();

        if (_color_value.length === 4 && _color_value[3] === "F") {
            _color_value = _color_value.substring(0, 3);
        } else if (
            _color_value.length === 8 &&
            `${_color_value[6]}${_color_value[7]}` === "FF"
        ) {
            _color_value = _color_value.substring(0, 6);
        }

        const _replaced = _color_value.replace(/#/g, "");
        color.color = `#${_replaced}`;
        color.text = _replaced;
        color.invert_color = invertColor(_color_value);

        const _splits = _replaced.split("");
        switch (_replaced.length) {
            case 3:
                color.rgba.r = parseInt(`0x${_splits[0]}${_splits[0]}`);
                color.rgba.g = parseInt(`0x${_splits[1]}${_splits[1]}`);
                color.rgba.b = parseInt(`0x${_splits[2]}${_splits[2]}`);
                break;
            case 4:
                color.rgba.r = parseInt(`0x${_splits[0]}${_splits[0]}`);
                color.rgba.g = parseInt(`0x${_splits[1]}${_splits[1]}`);
                color.rgba.b = parseInt(`0x${_splits[2]}${_splits[2]}`);
                color.rgba.a = parseInt(`0x${_splits[3]}${_splits[3]}`) / 255;
                break;
            case 6:
                color.rgba.r = parseInt(`0x${_splits[0]}${_splits[1]}`);
                color.rgba.g = parseInt(`0x${_splits[2]}${_splits[3]}`);
                color.rgba.b = parseInt(`0x${_splits[4]}${_splits[5]}`);
                break;
            case 8:
                color.rgba.r = parseInt(`0x${_splits[0]}${_splits[1]}`);
                color.rgba.g = parseInt(`0x${_splits[2]}${_splits[3]}`);
                color.rgba.b = parseInt(`0x${_splits[4]}${_splits[5]}`);
                color.rgba.a = parseInt(`0x${_splits[6]}${_splits[7]}`) / 255;
                break;
        }

        if (history_push) {
            registColorHistory(color.color);
        }

        return color.color;
    };

    const registColorHistory = (value: string) => {
        if (history.color.length > 100) {
            history.color.shift();
            history.color.shift();
        }

        history.color.push(value);
        // console.log(history.color);

        history.color = JSON.parse(JSON.stringify(history.color));
        const _st = JSON.stringify(history.color);
        localStorage.setItem(COLOR_HISTORY_KEY, _st);
    };

    const isColor = (_v: string) => {
        //  /([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const hash_replaced = _v.replace(/#/g, "");
        const regex =
            /^([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const _is = regex.test(hash_replaced);
        console.log(`is color:${_v}:${_is}`);
        return _is;
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

    const getRandomColor = (include_alpha = false) => {
        let _c = "";
        for (var i = 0; i < 6; i++) {
            _c += ((16 * Math.random()) | 0).toString(16);
        }
        if (include_alpha) {
            for (var i = 0; i < 2; i++) {
                _c += ((16 * Math.random()) | 0).toString(16);
            }
        } else {
            _c += "FF";
        }
        return _c;
    };

    const reloadRandomColor = () => {
        applyColor(getRandomColor(switcher.alpha));
    };

    {
        const _history = localStorage.getItem(COLOR_HISTORY_KEY);
        console.log("history-is");

        console.log(_history);

        if (_history && _history.length > 0) {
            history.color = JSON.parse(_history);
        }

        reloadRandomColor();
    }

    // #
</script>

<div class="page fl cl" style="background-color: {color.color}">
    <!-- Color History Bar -->
    <aside class="color-history">
        <ul>
            {#each history.color.reverse() as _, i}
                <li>
                    <div
                        class="box"
                        style={`background-color: ${_}`}
                        title={_}
                        on:click={() => applyColor(_, false)}
                    ></div>
                </li>
            {/each}
        </ul>
    </aside>
    <!-- Color View And Action. -->
    <div class="abs-1 fl j-c g-2">
        <b class="color-code-preview">{color.color}</b>
        <button type="button" class="btn-tr mt-1" on:click={copyColor}>
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
        <button type="button" class="btn-tr mt-1" on:click={reloadRandomColor}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="36"
                viewBox="0 -960 960 960"
                width="36"
                fill="#eee"
            >
                <path
                    d="M160-160v-80h110l-16-14q-52-46-73-105t-21-119q0-111 66.5-197.5T400-790v84q-72 26-116 88.5T240-478q0 45 17 87.5t53 78.5l10 10v-98h80v240H160Zm400-10v-84q72-26 116-88.5T720-482q0-45-17-87.5T650-648l-10-10v98h-80v-240h240v80H690l16 14q49 49 71.5 106.5T800-482q0 111-66.5 197.5T560-170Z"
                /></svg
            >
        </button>
        <label class="label-box fl g-1 mt-1">
            <span>透明度</span>
            <input type="checkbox" bind:checked={switcher.alpha} hidden />
            {#if switcher.alpha}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28"
                    viewBox="0 -960 960 960"
                    width="28"
                    fill="#fff"
                    ><path
                        d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
                    /></svg
                >
            {:else}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28"
                    viewBox="0 -960 960 960"
                    width="28"
                    fill="#fff"
                    ><path
                        d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z"
                    /></svg
                >
            {/if}
        </label>
    </div>
    <!-- Color Input Board -->
    <div class="abs-2 fl j-c">
        <div class="p-5 main-board">
            <div class="fl j-c g-1 color-card color-control p-2">
                <b class="sharp">#</b>
                <input
                    type="text"
                    value={color.text}
                    on:input={onInputColorText}
                    on:click={onClickSelect}
                />
                <input
                    type="color"
                    value={color.color}
                    on:input={onInputColorPicker}
                />
                <button
                    on:click={() => registColorHistory(color.color)}
                    class="btn-tr"
                    id="history-save-btn">S</button
                >
            </div>
            <div class="fl g-1 p-2 color-card rgba">
                <b class="rgb">RGBA</b>
                <input
                    type="number"
                    value={color.rgba.r}
                    on:click={onClickSelect}
                />
                <input
                    type="number"
                    value={color.rgba.g}
                    on:click={onClickSelect}
                />
                <input
                    type="number"
                    value={color.rgba.b}
                    on:click={onClickSelect}
                />
                <input
                    type="number"
                    step="0.1"
                    value={color.rgba.a}
                    on:click={onClickSelect}
                />
            </div>
        </div>
    </div>
    <!-- Color Info -->
    <aside class="aside-board">
        <b class="title">ColorDD</b>
        <ul>
            <li>
                <div>
                    <span>指定色：{color.color}</span>
                    <!-- <div
                        class="box"
                        style={`background-color: ${_}`}
                        on:click={() => applyColor(_, false)}
                    ></div> -->
                </div>
            </li>
            <li>
                <div>
                    <span>反対色：{color.invert_color}</span>
                    <!-- <div
                        class="box"
                        style={`background-color: ${color.invert_color}`}
                        on:click={() => applyColor(color.invert_color)}
                    ></div> -->
                </div>
            </li>
            <!-- <li>It's Grate!</li> -->
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
            @media screen and (max-width: 1000px) {
                font-size: 2rem;
            }
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
                #history-save-btn {
                    color: #222;
                    border: solid 1px #222;
                }
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
            &[type="number"] {
                font-size: 1.5rem;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
            }
            &[type="color"] {
                width: 50px;
                cursor: pointer;
            }
            &[type="checkbox"] {
                width: 30px;
                height: 30px;
                cursor: pointer;
            }
        }

        .color-card {
            background-color: #fff;
            &.color-control {
                .sharp {
                    font-size: 2rem;
                }
            }

            &.rgba {
                .rgb {
                    font-size: 1.4rem;
                    @media screen and (max-width: 1000px) {
                        font-size: 1.2rem;
                    }
                }
                input {
                    width: 60px;
                    @media screen and (max-width: 1000px) {
                        width: 45px;
                        font-size: 1.3rem;
                    }
                }
            }
        }

        .btn-tr {
            background: transparent;
            border: 1px solid #eee;
            color: #eee;
            border-radius: 0.3em;
            cursor: pointer;
        }

        .label-box {
            border: solid 1px #fff;
            border-radius: 0.3em;
            color: #fff;
            cursor: pointer;
            padding: 0.3rem 0.5rem;
        }

        .aside-board {
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 0 0 0 0.5rem;
            background-color: rgba($color: #fff, $alpha: 0.7);
            padding: 0.5rem 1rem 1rem;

            .title {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
                display: block;
            }
            ul {
                margin: 0;
                padding: 0;
                li {
                    list-style: none;
                    .box {
                        height: 30px;
                        width: 30px;
                        border: solid 1px #fff;
                    }
                }
            }
        }

        .color-history {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            background-color: rgba($color: #fff, $alpha: 0.7);
            z-index: 2;
            height: 100vh;
            overflow-y: scroll;
            ul {
                padding: 0;
                margin: 0;
                li {
                    list-style: none;
                }
            }
            .box {
                height: 30px;
                width: 30px;
                border: solid 1px #fff;
            }
        }
    }
</style>
