<?php
class UserProfileWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: userProfileViewModel -->
        <div data-bind="visible: showUserProfile">
            <ul>
                <li class="data-list">
                    <label><?php echo Translation::getString('username'); ?>:</label>
                    <span data-bind="text: username"></span>
                </li>
                <li class="data-list">
                    <label><?php echo Translation::getString('territoryBonus'); ?>:</label>
                    <span data-bind="text: territoryBonus"></span>
                    <button data-bind="click: showGiveTerritoryBonusDialog" class="ui-button ui-widget ui-corner-all ui-button-icon-only outset-icon-button">
                        <span class="ui-icon ui-icon-caret-1-e"></span>
                    </button>
                </li>
                <li class="button-panel">
                    <input type="button" data-bind="click: back" value="<?php echo Translation::getString("back"); ?>" class="ui-button ui-widget ui-corner-all" />
                </li>
            </ul>
            <?php
            $selectUserDialogWidget = new SelectUserDialogWidget();
            $selectUserDialogWidget->render();
            ?>            
        </div>
        <!-- /ko -->
        <?php
    }
}
?>