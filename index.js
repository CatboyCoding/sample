const { Plugin } = require("powercord/entities");
const { findInReactTree } = require("powercord/util");
const { getModule, React } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

const Settings = require("./components/Settings.jsx");

module.exports = class Sample extends Plugin {
    async startPlugin() { // Called on load
        this.log("Hello World!");

        if(!this.settings.get("text"))
            this.settings.set("text", "Sample"); // Default value

        const Menu = await getModule(["MenuGroup", "MenuItem"]);
        const MessageContextMenu = await getModule(m => m.default && m.default.displayName == "MessageContextMenu");

        inject("sample-injection", MessageContextMenu, "default", (args, res) => {
            if (!findInReactTree(res, c => c.props && c.props.id == "sample-text")) {
                const item = React.createElement(Menu.MenuItem, {
                    action: () => this.log(args[0].message),
                    id: "sample-test",
                    label: "Sample option"
                });
                const element = React.createElement(Menu.MenuGroup, null, item);
                res.props.children.push(element);
            }

            return res;
        });

        powercord.api.settings.registerSettings("sample", {
            category: this.entityID,
            label: "Sample Settings",
            render: Settings
        })

        powercord.api.commands.registerCommand({
            command: "sample",
            aliases: [],
            description: "Sample command.",
            executor: (args) => this.sampleExecutor(args) // js dumb
        })
    }

    sampleExecutor(args) {
        if(args.length !== 0) {
            let arg = "";
            while(args.length > 0)
                arg += " " + args.shift();

            return {
                send: false,
                result: arg,
            }
        } else {
            return {
                send: false,
                result: this.settings.get("text"),
            }
        }
    }

    pluginWillUnload() {
        powercord.api.settings.unregisterSettings("sample");
        powercord.api.commands.unregisterCommand("sample");
        uninject("sample-injection");
    }
}