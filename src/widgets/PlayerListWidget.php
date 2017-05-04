<?php
class PlayerListWidget {
    public function render() {
        ?>
        <!-- ko with: playerListViewModel -->
        <table data-bind="stupidtable: {}">
            <thead>
                <th data-sort="string"><?php echo Translation::getString("name"); ?></th>
                <th data-sort="string"><?php echo Translation::getString("faction"); ?></th>
                <th data-sort="int"><?php echo Translation::getString("attacks"); ?></th>
                <th data-sort="string"><?php echo ucfirst(Translation::getString("admin")); ?></th>
                <th data-bind="visible: isUserAdmin"></th>
            </thead>
            <tbody data-bind="foreach: players">
                <tr>
                    <td data-bind="text: username" />
                    <td data-bind="text: factionName" />
                    <td data-bind="text: attacks" />
                    <td>
                        <!-- ko if: canChangeAdminStatus -->
                        <input type="checkbox" data-bind="checked: isPlayerAdmin" />
                        <!-- /ko -->
                        <!-- ko ifnot: canChangeAdminStatus -->
                        <span data-bind="css: { 'icon-cross': !isPlayerAdmin(), 'icon-checkmark': isPlayerAdmin }"></span>
                        <!-- /ko -->
                    </td>
                    <td data-bind="visible: isUserAdmin">
                        <button data-bind="click: giveTerritoryBonus, tooltip: Translation.getString('giveOneTerritoryBonusTooltip')" class="ui-button ui-widget ui-corner-all inline-icon-button">
                            <span class="icon-upload"></span>
                        </button>
                    </td>
                <tr>
            </tbody>
        </table>
        <!-- /ko -->
        <?php
    }
}
?>