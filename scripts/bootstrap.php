<?php

# --------------------------
# Load Bootstraper

require_once(dirname(__FILE__).'/bootstrapr.php');

# --------------------------
# Boostrap Bootstraper

$Bootstrapr = Bootstrapr::getInstance();
$Bootstrapr->bootstrap('run');
