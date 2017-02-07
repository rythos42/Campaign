<?php
class CampaignListWidget implements IWidget {
    public function render() {
        ?>
        <!-- ko with: campaignListViewModel -->
        <table data-bind="visible: showCampaignList">
            <tbody data-bind="foreach: campaignList">
                <tr>
                    <td>
						<button data-bind="text: name, click: createCampaignEntry" />
					</td>
                </tr>
            </tbody>
        </table>
        <!-- /ko -->
        <?php
    }    
}
?>