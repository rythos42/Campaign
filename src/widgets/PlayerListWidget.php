<?php
class PlayerListWidget {
    public function render() {
        ?>
        <!-- ko with: playerListViewModel -->
        <table>
            <thead>
                <th><?php echo Translation::getString("name"); ?></th>
                <th><?php echo Translation::getString("faction"); ?></th>
                <th><?php echo Translation::getString("attacks"); ?></th>
            </thead>
            <tbody data-bind="foreach: players">
                <tr>
                    <td data-bind="text: username" />
                    <td data-bind="text: factionName" />
                    <td data-bind="text: attacks" />
                <tr>
            </tbody>
        </table>
        <!-- /ko -->
        <?php
    }
}
?>