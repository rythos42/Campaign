<?php
class HelpWidget {
    public function render() {
        ?>
        <!-- ko with: helpViewModel -->
        <div id="Help" data-bind="visible: isShowingHelp" style="display: none">
            <?php echo Translation::getString("helpText"); ?>
        </div>
        <!-- /ko -->
        <?php
    }
}





 





















