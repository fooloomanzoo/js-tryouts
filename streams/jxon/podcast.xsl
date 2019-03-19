<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/rss/channel">
  <html>
    <head>
      <title><xsl:value-of select="title" /></title>
      <style type="text/css">
        @import url(themes/dradio/podcast/podcast.css);
      </style>
    </head>
    <body>
      <div id="content">
        <h1><xsl:value-of select="title" /></h1>
        <xsl:value-of select="itunes" />
        <ul id="items">
          <xsl:for-each select="item">
            <li>
              <h2><a href="{link}"><xsl:value-of select="title" /></a> &#8594;<a href="{enclosure/@url}">MP3</a></h2>
              <h3>
                <xsl:call-template name="format-date">
                  <xsl:with-param name="dateTime" select="pubDate" />
                </xsl:call-template>
              </h3>
              <p>
                <xsl:value-of disable-output-escaping="yes" select="description" />
              </p>
            </li>
          </xsl:for-each>
        </ul>
      </div>
    </body>
  </html>
</xsl:template>

<xsl:template name="format-date">
  <xsl:param name="dateTime"/>
  <xsl:variable name="time" select="substring($dateTime, string-length($dateTime) - 13, 5)" />
  <xsl:variable name="year" select="substring($dateTime, string-length($dateTime) -18, 4)" />
  <xsl:variable name="month" select="substring($dateTime, string-length($dateTime) -22, 3)" />
  <xsl:variable name="day" select="substring($dateTime, string-length($dateTime) -25, 2)" />
  <xsl:choose>
  <xsl:when test="$day &lt; 10">
    0<xsl:value-of select="substring($day, 2,1)" />
  </xsl:when>
  <xsl:otherwise><xsl:value-of select="$day" /></xsl:otherwise>
  </xsl:choose>
  <xsl:text>. </xsl:text>
  <xsl:choose>
    <xsl:when test="$month = 'Jan'">Januar </xsl:when>
    <xsl:when test="$month = 'Feb'">Februar </xsl:when>
    <xsl:when test="$month = 'Mar'">März </xsl:when>
    <xsl:when test="$month = 'Apr'">April </xsl:when>
    <xsl:when test="$month = 'May'">Mai </xsl:when>
    <xsl:when test="$month = 'Jun'">Juni </xsl:when>
    <xsl:when test="$month = 'Jul'">Juli </xsl:when>
    <xsl:when test="$month = 'Aug'">August </xsl:when>
    <xsl:when test="$month = 'Sep'">September </xsl:when>
    <xsl:when test="$month = 'Oct'">Oktober </xsl:when>
    <xsl:when test="$month = 'Nov'">November </xsl:when>
    <xsl:when test="$month = 'Dec'">Dezember </xsl:when>
  </xsl:choose>
  <xsl:value-of select="$year" />
  <xsl:text>, </xsl:text>
  <xsl:value-of select="$time" />
  <xsl:text> Uhr</xsl:text>
</xsl:template>
</xsl:stylesheet>