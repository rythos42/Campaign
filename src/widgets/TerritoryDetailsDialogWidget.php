<?php
class TerritoryDetailsDialogWidget {
    public function render() {
        ?>
        <!-- ko with: territoryDetailsDialogViewModel -->
        <div data-bind="dialog: { title: dialogTitle, width: 300}, dialogOpenClose: dialogOpenClose">
            <ul>
                <li class="data-list">
                    <label><?php echo Translation::getString('tags'); ?>:</label> <span data-bind="text: tags"></span>
                </li>
                <li class="data-list">
                    <label><?php echo Translation::getString('ownedBy'); ?>:</label> <span data-bind="text: ownedBy"></span>
                </li>
                <li class="button-panel">
                    <input type="button" data-bind="click: attack" value="<?php echo Translation::getString("attack"); ?>" class="ui-button ui-widget ui-corner-all" />
                    <input type="button" data-bind="click: cancel" value="<?php echo Translation::getString("cancel"); ?>" class="ui-button ui-widget ui-corner-all" />
                </li>
            </ul>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>