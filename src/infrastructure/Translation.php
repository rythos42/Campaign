<?php
class Translation {
    private static $translationDocs;
    private static $currentLocale;
    
    public static function loadTranslationFiles($translationPath) {
        $translationFiles = array_diff(scandir($translationPath), array('.', '..'));
        
        foreach($translationFiles as $translationFile) {
            $document = new DOMDocument();
            $document->Load($translationPath . "/" . $translationFile);
            
            $locale = self::getNodeValue($document, "//translation/locale");
            
            self::$translationDocs[$locale] = $document;
        }
        
        self::$currentLocale = "en-US";
    }  
    
    private static function getNodeValue($document, $xpathQuery) { 		
        $xpath = new DOMXpath($document);
        $query = $xpath->query($xpathQuery);
        return (string) $query->item(0)->nodeValue;
    }
    
    public static function getJson() {
        $currentDocument = self::$translationDocs[self::$currentLocale];

        $stringXml = simplexml_load_string($currentDocument->saveXML());
        return json_encode($stringXml);
    }
    
    public static function getString($xpathQuery) {
        $currentDocument = self::$translationDocs[self::$currentLocale];
        
        return self::getNodeValue($currentDocument, "//translation/strings/$xpathQuery");
    }
}
?>