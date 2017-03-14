<?php
class CampaignListWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: campaignListViewModel -->
        <div id="CampaignList" data-bind="visible: showCampaignList" class="grouping">
            <div class="entry-field">
                <label for="CampaignListFilter"><?php echo Translation::getString("filter"); ?></label>
                <input id="CampaignListFilter" type="text" data-bind="value: campaignListFilter, valueUpdate: 'keyup'" />
            </div>
            <table data-bind="visible: hasCampaigns" class="ui-widget ui-corners-all ui-widget-content">
                <thead>
                    <th><span class="ui-widget-title"><?php echo Translation::getString("availableCampaigns"); ?></span></th>
                </thead>
                <tbody data-bind="foreach: campaignList">
                    <tr>
                        <td>
                            <button data-bind="text: name, click: createCampaignEntry" class="link-button" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- /ko -->
        <?php
    }
}
?>