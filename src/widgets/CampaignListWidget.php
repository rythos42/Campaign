<?php
class CampaignListWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: campaignListViewModel -->
        <table data-bind="visible: showCampaignList">
            <tbody data-bind="foreach: campaignList">
                <td>
                    <tr data-bind="text: name" />
                </td>
            </tbody>
        </table>
        <!-- /ko -->
        <?php
    }    
}
?>