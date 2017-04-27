<?php
class RenameFactionDialogWidget {
    public function render() {
        ?>
        <!-- ko with: renameFactionDialogViewModel -->
        <div data-bind="dialog: { title: '<?php echo Translation::getString("renameFaction"); ?>', width: 300}, dialogOpenClose: dialogOpenClose">
            <ul>
                <li class="entry-field">
                    <label for="RenameFactionDropDown"><?php echo Translation::getString("faction"); ?>: </label>
                    <select id="RenameFactionDropDown" data-bind="options: factions, optionsText: 'name', value: selectedFaction, optionsCaption: '<?php echo Translation::getString("selectFaction"); ?>'"></select>
                </li>
                <li class="entry-field">
                    <label for="NewFactionName"><?php echo Translation::getString("newFactionName"); ?>: </label>
                    <input id="NewFactionName" type="text" data-bind="value: newFactionName">
                </li>
                <li class="button-panel">
                    <input type="button" data-bind="click: renameFaction" value="<?php echo Translation::getString("renameFaction"); ?>" class="ui-button ui-widget ui-corner-all" />
                    <input type="button" data-bind="click: cancel" value="<?php echo Translation::getString("cancel"); ?>" class="ui-button ui-widget ui-corner-all" />
                </li>
            </ul>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>