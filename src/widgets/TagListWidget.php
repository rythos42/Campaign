<?php
class TagListWidget {
    public function render() {
        ?>
        <!-- ko with: tagListViewModel -->
        <table data-bind="stupidtable: {}, visible: hasJoinedCampaign">
            <thead>
                <th data-sort="int"><?php echo Translation::getString("territory"); ?></th>
                <th data-sort="string"><?php echo Translation::getString("tags"); ?></th>
                <th data-bind="visible: isAdmin"></th>
            </thead>
            <tbody data-bind="foreach: territories">
                <tr>
                    <td data-bind="text: territoryId" />
                    <td>
                        <span data-bind="text: tags, visible: !isEditing()"></span>
                        <input type="text" data-bind="value: tags, visible: isEditing, onEnter: saveTag, hasFocus: hasFocus" />
                    </td>
                    <td class="actions" data-bind="visible: $parent.isAdmin">
                        <button class="button-icon" data-bind="click: editTag, tooltip: '<?php echo Translation::getString("edit"); ?>'">
                            <span class="icon-pencil"></span>
                        </button>
                    </td>
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