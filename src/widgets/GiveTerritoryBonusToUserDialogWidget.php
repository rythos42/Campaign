<?php
class GiveTerritoryBonusToUserDialogWidget implements IWidget {
    public function render() {
        ?>
            <!-- ko with: giveTerritoryBonusToUserDialogViewModel -->
            <div data-bind="dialog: { title: Translation.getString('giveTerritoryBonusDialogTitle') }, dialogOpenClose: dialogOpenClose">
                <ul>
                    <li class="entry-field">
                        <label for="UserSelection"><?php echo Translation::getString("user"); ?>:</label>
                        <input type="text" id="UserSelection" data-bind="jqAuto: { value: selectedUser, source: getUsers, inputProp: 'label', labelProp: 'label', valueProp: 'object' }, validationElement: selectedUser"></select>
                        <span class="validationMessage" data-bind="validationMessage: selectedUser"></span>
                    </li>
                    <li class="entry-field">
                        <label for="Amount"><?php echo Translation::getString("amount"); ?>:</label>
                        <input id="Amount" type="number" data-bind="value: amountToGive" />
                    </li>
                    <li class="button-panel">
                        <input type="button" data-bind="click: ok" value="<?php echo Translation::getString("ok"); ?>" class="ui-button ui-widget ui-corner-all" />
                        <input type="button" data-bind="click: cancel" value="<?php echo Translation::getString("cancel"); ?>" class="ui-button ui-widget ui-corner-all" />
                    </li>
                </ul>
            </div>
            <!-- /ko -->
        <?php
    }
}
?>