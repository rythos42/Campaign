<?php
class EditTerritoryDialogWidget {
    public function render() {
        ?>
            <!-- ko with: editTerritoryDialogViewModel -->
            <div data-bind="dialog: { title: dialogTitle, width: 300 }, dialogOpenClose: dialogOpenClose">
                <ul>
                    <li class="entry-field">
                        <label for="FactionSelection"><?php echo Translation::getString("faction"); ?>:</label>
                        <select id="FactionSelection" data-bind="options: availableFactions, optionsText: 'name', value: selectedFaction, optionsCaption: Translation.getString('selectFaction')"></select>
                    </li>
                 <li class="button-panel">
                        <input type="button" data-bind="click: save" value="<?php echo Translation::getString("save"); ?>" class="ui-button ui-widget ui-corner-all" />
                        <input type="button" data-bind="click: cancel" value="<?php echo Translation::getString("cancel"); ?>" class="ui-button ui-widget ui-corner-all" />
                    </li>
                </ul>
            </div>
            <!-- /ko -->
        <?php
    }
}
?>