<?php
class CampaignListWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: campaignListViewModel -->
        <div data-bind="visible: showCampaignList">
            <label for="CampaignListFilter">Filter:</label>
            <input id="CampaignListFilter" type="text" data-bind="value: campaignListFilter, valueUpdate: 'keyup'" />
            <table
                <tbody data-bind="foreach: campaignList">
                    <tr>
                        <td>
                            <button data-bind="text: name, click: createCampaignEntry" />
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