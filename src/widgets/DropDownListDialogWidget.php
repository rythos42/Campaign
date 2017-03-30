<?php
class DropDownListDialogWidget {
    public function render($title, $successText, $cancelText) {
        ?>
        <div data-bind="dialog: { title: '<?php echo $title; ?>', width: 300}, dialogOpenClose: dialogOpenClose">
            <ul>
                <li>
                    <select data-bind="options: options, optionsText: textProperty, value: selectedValue, optionsCaption: caption"></select>
                </li>
                <li class="button-panel">
                    <input type="button" data-bind="click: ok" value="<?php echo $successText; ?>" class="ui-button ui-widget ui-corner-all" />
                    <input type="button" data-bind="click: cancel" value="<?php echo $cancelText; ?>" class="ui-button ui-widget ui-corner-all" />
                </li>
            </ul>
        </div>
        <?php
    }
}
?>