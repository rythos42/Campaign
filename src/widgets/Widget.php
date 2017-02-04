<?php
abstract class Widget implements IWidget {
	protected function getRequest($key) {
		return isset($_REQUEST[$key]) ? $_REQUEST[$key] : null;
	}
    
    public static function getWidgetClassNames() {
        $widgets = array_filter(
            get_declared_classes(), 
            function ($className) {
                // all return implements, except the base class
                return in_array('IWidget', class_implements($className)) && $className != 'Widget';
            });
            
        usort(
            $widgets,
            function($a, $b) {
                if ($a == $b)
                    return 0;
                                                
                // Ensure LoginWidget is always at the beginning
                if($a == 'LoginWidget')
                    return -1;
                if($b == 'LoginWidget')
                    return 1;
                
                return ($a < $b) ? -1 : 1;
            });
            
        return $widgets;
    }
}
?>