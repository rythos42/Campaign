<?php
class SimpleTextDialogWidget {
    public function render($title, $text, $hideDialogText) {
        ?>
        <div data-bind="dialog: { title: '<?php echo $title; ?>'}, dialogOpenClose: dialogOpenClose" style="display: none;">
            <ul>
                <li>
                    <div><?php echo $text; ?></div>
                </li>
                <li class="button-panel">
                    <input type="button" data-bind="click: ok" value="<?php echo $hideDialogText; ?>" class="ui-button ui-widget ui-corner-all" />
                </li>
            </ul>
        </div>
        <?php
    }
}
?>