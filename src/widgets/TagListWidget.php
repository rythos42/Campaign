<?php
class TagListWidget {
    public function render() {
        ?>
        <!-- ko with: tagListViewModel -->
        <table data-bind="stupidtable: {}, visible: hasJoinedCampaign">
            <thead>
                <th data-sort="int"><?php echo Translation::getString("territory"); ?></th>
                <th data-sort="string"><?php echo Translation::getString("tags"); ?></th>
            </thead>
            <tbody data-bind="foreach: territories">
                <tr>
                    <td data-bind="text: territoryId" />
                    <td data-bind="text: tags" />
                <tr>
            </tbody>
        </table>
        <div class="join-to-see" data-bind="visible: !hasJoinedCampaign()">
            <?php echo Translation::getString('joinToSee'); ?>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>