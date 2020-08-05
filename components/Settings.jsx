const { React, getModuleByDisplayName } = require("powercord/webpack");
const { Button, AsyncComponent } = require("powercord/components");
const { TextInput } = require("powercord/components/settings");
const FormText = AsyncComponent.from(getModuleByDisplayName("FormText"));

module.exports = class Settings extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div>
                <TextInput
                    value={this.props.getSetting("text")}
                    onChange={v => this.props.updateSetting("text", v)}
                    note={"Lorem ipsum dolor sit amet."}
                >
                    Sample Text
                </TextInput>
                <FormText>Value: {this.props.getSetting("text")}</FormText>
            </div>
        )
    }
}